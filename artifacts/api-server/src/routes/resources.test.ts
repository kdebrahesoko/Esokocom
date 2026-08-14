/**
 * Integration tests for Resources CMS backend.
 *
 * Covers:
 *   1. CONTENT_AUTHOR access control — enforces Draft-only creation and editing.
 *   2. Tag atomicity — invalid tag IDs are rejected before any mutation; original
 *      tag relationships survive a failed update.
 *
 * Requires a running PostgreSQL database (DATABASE_URL env).
 * Shares the development DB and cleans up after itself.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../app";
import { db } from "@workspace/db";
import {
  usersTable, sessionsTable,
  resourcesTable, resourceTagsTable, resourceTagRelationshipsTable,
} from "@workspace/db";
import bcrypt from "bcryptjs";
import { randomBytes, createHash } from "crypto";
import { eq, and } from "drizzle-orm";

/* ── helpers ─────────────────────────────────────────────────────────── */
function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function createTestUser(role: "CONTENT_AUTHOR" | "CONTENT_EDITOR") {
  const email    = `test-${role.toLowerCase()}-${randomBytes(4).toString("hex")}@test.example`;
  const password = await bcrypt.hash("TestPass123!", 4); // low rounds for speed in tests
  const [user]   = await db.insert(usersTable).values({
    email, name: `Test ${role}`, role, passwordHash: password, isActive: true,
  }).returning();
  return user;
}

async function createTestSession(userId: number): Promise<string> {
  const token     = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 3_600_000); // 1 hour
  await db.insert(sessionsTable).values({ userId, tokenHash, expiresAt });
  return token;
}

async function cleanup(userIds: number[], resourceIds: number[], tagIds: number[]) {
  // Tag relationships + resources cascade on delete; just delete roots
  if (tagIds.length)     await db.delete(resourceTagsTable).where(eq(resourceTagsTable.id, tagIds[0]));
  if (resourceIds.length) {
    for (const id of resourceIds) {
      await db.delete(resourcesTable).where(eq(resourcesTable.id, id)).catch(() => {});
    }
  }
  if (userIds.length) {
    for (const id of userIds) {
      await db.delete(sessionsTable).where(eq(sessionsTable.userId, id)).catch(() => {});
      await db.delete(usersTable).where(eq(usersTable.id, id)).catch(() => {});
    }
  }
}

/* ── test state ─────────────────────────────────────────────────────── */
let authorId     = 0;
let editorId     = 0;
let authorCookie = "";
let editorCookie = "";

const createdResourceIds: number[] = [];
const createdTagIds:      number[] = [];
const createdUserIds:     number[] = [];

beforeAll(async () => {
  const author   = await createTestUser("CONTENT_AUTHOR");
  const editor   = await createTestUser("CONTENT_EDITOR");
  authorId = author.id;
  editorId = editor.id;
  createdUserIds.push(author.id, editor.id);

  const authorToken = await createTestSession(author.id);
  const editorToken = await createTestSession(editor.id);
  authorCookie = `esoko_sess=${authorToken}`;
  editorCookie = `esoko_sess=${editorToken}`;
});

afterAll(async () => {
  await cleanup(createdUserIds, createdResourceIds, createdTagIds);
});

/* ════════════════════════════════════════════════════════════════════════
   1. CONTENT_AUTHOR access control
   ════════════════════════════════════════════════════════════════════════ */
describe("CONTENT_AUTHOR access control", () => {
  it("forces status to Draft when CONTENT_AUTHOR tries to create with In Review status", async () => {
    const res = await request(app)
      .post("/api/admin/resources")
      .set("Cookie", authorCookie)
      .send({
        contentType:      "Blog",
        title:            "Author Test Post",
        slug:             `author-test-post-${randomBytes(4).toString("hex")}`,
        shortDescription: "Test",
        status:           "In Review",  // author tries to skip to In Review
      });

    expect(res.status).toBe(201);
    expect(res.body.resource.status).toBe("Draft");  // must be forced to Draft
    createdResourceIds.push(res.body.resource.id);
  });

  it("rejects CONTENT_AUTHOR creating with Published status", async () => {
    const res = await request(app)
      .post("/api/admin/resources")
      .set("Cookie", authorCookie)
      .send({
        contentType:      "Blog",
        title:            "Author Published Attempt",
        slug:             `author-pub-attempt-${randomBytes(4).toString("hex")}`,
        shortDescription: "Test",
        status:           "Published",
      });

    expect(res.status).toBe(201);
    expect(res.body.resource.status).toBe("Draft");  // must be forced to Draft
    createdResourceIds.push(res.body.resource.id);
  });

  it("allows CONTENT_AUTHOR to edit their own Draft resource", async () => {
    // Create a draft resource as the author
    const createRes = await request(app)
      .post("/api/admin/resources")
      .set("Cookie", authorCookie)
      .send({
        contentType: "Blog", title: "My Draft Post",
        slug: `my-draft-post-${randomBytes(4).toString("hex")}`, shortDescription: "Test",
      });
    expect(createRes.status).toBe(201);
    const resourceId = createRes.body.resource.id;
    createdResourceIds.push(resourceId);

    const updateRes = await request(app)
      .put(`/api/admin/resources/${resourceId}`)
      .set("Cookie", authorCookie)
      .send({ title: "My Draft Post (Updated)" });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.resource.title).toBe("My Draft Post (Updated)");
  });

  it("prevents CONTENT_AUTHOR from editing a resource they do not own", async () => {
    // Create a resource as the editor
    const createRes = await request(app)
      .post("/api/admin/resources")
      .set("Cookie", editorCookie)
      .send({
        contentType: "Blog", title: "Editor Post",
        slug: `editor-post-${randomBytes(4).toString("hex")}`, shortDescription: "Test",
      });
    expect(createRes.status).toBe(201);
    const resourceId = createRes.body.resource.id;
    createdResourceIds.push(resourceId);

    // Author tries to edit editor's resource
    const res = await request(app)
      .put(`/api/admin/resources/${resourceId}`)
      .set("Cookie", authorCookie)
      .send({ title: "Hijacked Title" });

    expect(res.status).toBe(403);
  });

  it("prevents CONTENT_AUTHOR from editing a resource that is In Review", async () => {
    // Editor creates and moves to In Review
    const createRes = await request(app)
      .post("/api/admin/resources")
      .set("Cookie", editorCookie)
      .send({
        contentType: "Blog", title: "In Review Post",
        slug: `in-review-post-${randomBytes(4).toString("hex")}`, shortDescription: "Test",
        status: "In Review",
      });
    expect(createRes.status).toBe(201);
    const resourceId = createRes.body.resource.id;
    createdResourceIds.push(resourceId);
    expect(createRes.body.resource.status).toBe("In Review");

    // Author — who happens to be the same person in a real scenario but here
    // we simulate: insert a resource directly as author, put it In Review via DB
    const [authorResource] = await db.insert(resourcesTable).values({
      contentType: "Blog",
      title: "Author In-Review Resource",
      slug: `author-in-review-${randomBytes(4).toString("hex")}`,
      status: "In Review",  // already In Review
      createdBy: authorId,
      updatedBy: authorId,
      authorId,
    }).returning();
    createdResourceIds.push(authorResource.id);

    const res = await request(app)
      .put(`/api/admin/resources/${authorResource.id}`)
      .set("Cookie", authorCookie)
      .send({ title: "Trying to edit In Review" });

    expect(res.status).toBe(403);
  });

  it("prevents CONTENT_AUTHOR from publishing via PUT", async () => {
    // Create draft as author
    const createRes = await request(app)
      .post("/api/admin/resources")
      .set("Cookie", authorCookie)
      .send({
        contentType: "Blog", title: "Author Publish Attempt via PUT",
        slug: `author-pub-put-${randomBytes(4).toString("hex")}`, shortDescription: "Test",
      });
    expect(createRes.status).toBe(201);
    const resourceId = createRes.body.resource.id;
    createdResourceIds.push(resourceId);

    const res = await request(app)
      .put(`/api/admin/resources/${resourceId}`)
      .set("Cookie", authorCookie)
      .send({ status: "Published" });

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/Draft or In Review/);
  });

  it("allows CONTENT_AUTHOR to submit their Draft to In Review via PUT", async () => {
    const createRes = await request(app)
      .post("/api/admin/resources")
      .set("Cookie", authorCookie)
      .send({
        contentType: "Blog", title: "Submitting for Review",
        slug: `submitting-review-${randomBytes(4).toString("hex")}`, shortDescription: "Test",
      });
    expect(createRes.status).toBe(201);
    const resourceId = createRes.body.resource.id;
    createdResourceIds.push(resourceId);

    const res = await request(app)
      .put(`/api/admin/resources/${resourceId}`)
      .set("Cookie", authorCookie)
      .send({ status: "In Review" });

    expect(res.status).toBe(200);
    expect(res.body.resource.status).toBe("In Review");
  });

  it("prevents CONTENT_AUTHOR from publishing via the /publish endpoint", async () => {
    // Create a resource owned by the author
    const [resource] = await db.insert(resourcesTable).values({
      contentType: "Blog", title: "Author Publish Endpoint Test",
      slug: `author-pub-endpoint-${randomBytes(4).toString("hex")}`,
      status: "Draft", createdBy: authorId, updatedBy: authorId, authorId,
    }).returning();
    createdResourceIds.push(resource.id);

    const res = await request(app)
      .post(`/api/admin/resources/${resource.id}/publish`)
      .set("Cookie", authorCookie);

    // requireEditor middleware blocks this — 401 or 403
    expect([401, 403]).toContain(res.status);
  });
});

/* ════════════════════════════════════════════════════════════════════════
   2. Tag atomicity
   ════════════════════════════════════════════════════════════════════════ */
describe("Tag atomicity", () => {
  let testTag: { id: number; name: string; slug: string };

  beforeAll(async () => {
    // Create a real tag to use in tests
    const [tag] = await db.insert(resourceTagsTable).values({
      name: `test-tag-${randomBytes(4).toString("hex")}`,
      slug: `test-tag-${randomBytes(4).toString("hex")}`,
    }).returning();
    testTag = tag;
    createdTagIds.push(tag.id);
  });

  it("rejects invalid tag IDs on create without persisting the resource", async () => {
    const slug = `tag-atomic-create-${randomBytes(4).toString("hex")}`;
    const res  = await request(app)
      .post("/api/admin/resources")
      .set("Cookie", editorCookie)
      .send({
        contentType: "Blog", title: "Tag Atomic Create Test",
        slug, shortDescription: "Test",
        tagIds: [testTag.id, 9_999_999],  // one valid, one invalid
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid tag IDs/);
    expect(res.body.invalidIds).toContain(9_999_999);

    // Verify no resource was created (slug should not exist)
    const [row] = await db.select({ id: resourcesTable.id })
      .from(resourcesTable)
      .where(eq(resourcesTable.slug, slug));
    expect(row).toBeUndefined();
  });

  it("preserves original tags when update with invalid tag IDs fails", async () => {
    // Create a resource with the valid test tag
    const createRes = await request(app)
      .post("/api/admin/resources")
      .set("Cookie", editorCookie)
      .send({
        contentType: "Blog", title: "Tag Preserve Test",
        slug: `tag-preserve-${randomBytes(4).toString("hex")}`, shortDescription: "Test",
        tagIds: [testTag.id],
      });
    expect(createRes.status).toBe(201);
    const resourceId = createRes.body.resource.id;
    createdResourceIds.push(resourceId);

    // Attempt update with an invalid tag ID
    const updateRes = await request(app)
      .put(`/api/admin/resources/${resourceId}`)
      .set("Cookie", editorCookie)
      .send({
        tagIds: [testTag.id, 9_999_998],  // one valid, one invalid
      });

    expect(updateRes.status).toBe(400);
    expect(updateRes.body.invalidIds).toContain(9_999_998);

    // Verify the original tag relationship is still intact
    const [rel] = await db.select()
      .from(resourceTagRelationshipsTable)
      .where(
        and(
          eq(resourceTagRelationshipsTable.resourceId, resourceId),
          eq(resourceTagRelationshipsTable.tagId, testTag.id),
        ),
      );
    expect(rel).toBeDefined();  // original tag must still be there
  });

  it("successfully attaches valid tags to a resource on create", async () => {
    const res = await request(app)
      .post("/api/admin/resources")
      .set("Cookie", editorCookie)
      .send({
        contentType: "Blog", title: "Tag Attach Test",
        slug: `tag-attach-${randomBytes(4).toString("hex")}`, shortDescription: "Test",
        tagIds: [testTag.id],
      });

    expect(res.status).toBe(201);
    const resourceId = res.body.resource.id;
    createdResourceIds.push(resourceId);

    // Verify the tag relationship was created
    const [rel] = await db.select()
      .from(resourceTagRelationshipsTable)
      .where(
        and(
          eq(resourceTagRelationshipsTable.resourceId, resourceId),
          eq(resourceTagRelationshipsTable.tagId, testTag.id),
        ),
      );
    expect(rel).toBeDefined();
  });

  it("clears all tags when update sends empty tagIds array", async () => {
    const createRes = await request(app)
      .post("/api/admin/resources")
      .set("Cookie", editorCookie)
      .send({
        contentType: "Blog", title: "Tag Clear Test",
        slug: `tag-clear-${randomBytes(4).toString("hex")}`, shortDescription: "Test",
        tagIds: [testTag.id],
      });
    expect(createRes.status).toBe(201);
    const resourceId = createRes.body.resource.id;
    createdResourceIds.push(resourceId);

    // Update with empty tagIds
    await request(app)
      .put(`/api/admin/resources/${resourceId}`)
      .set("Cookie", editorCookie)
      .send({ tagIds: [] });

    const rels = await db.select()
      .from(resourceTagRelationshipsTable)
      .where(eq(resourceTagRelationshipsTable.resourceId, resourceId));
    expect(rels).toHaveLength(0);
  });
});
