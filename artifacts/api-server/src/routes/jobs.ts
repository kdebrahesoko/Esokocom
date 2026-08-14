import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import { z } from "zod";
import { db } from "@workspace/db";
import {
  jobsTable, applicationsTable, applicationNotesTable,
  type NewJob, type NewApplication,
} from "@workspace/db";
import { eq, sql, and, or, ilike, inArray, count } from "drizzle-orm";
import { ObjectStorageService } from "../lib/objectStorage";
import { logger } from "../lib/logger";
import { requireRole, audit } from "../lib/auth";

const router: IRouter = Router();

/* ── Object storage ──────────────────────────────────────────────────── */
const objectStorageService = new ObjectStorageService();

/* ── Multer (CV upload — memory only) ───────────────────────────────── */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    cb(null, allowed.includes(file.mimetype));
  },
});

/* ── Upload CV buffer via presigned-URL flow ─────────────────────────── */
async function uploadCvToGcs(buffer: Buffer, mimeType: string): Promise<string> {
  const uploadURL = await objectStorageService.getObjectEntityUploadURL();
  const uploadRes = await fetch(uploadURL, {
    method: "PUT",
    body: buffer,
    headers: { "Content-Type": mimeType },
  });
  if (!uploadRes.ok) throw new Error(`GCS upload failed: ${uploadRes.status}`);
  return objectStorageService.normalizeObjectEntityPath(uploadURL);
}

/* ── Helpers ─────────────────────────────────────────────────────────── */
function parseJsonField(value: string | null | undefined): string[] {
  if (!value) return [];
  try { return JSON.parse(value) as string[]; } catch { return []; }
}

function toJobResponse(row: typeof jobsTable.$inferSelect) {
  const msSinceCreation = Date.now() - new Date(row.createdAt).getTime();
  const postedDaysAgo = Math.max(0, Math.floor(msSinceCreation / (1000 * 60 * 60 * 24)));
  return {
    id:           row.slug,
    dbId:         row.id,
    slug:         row.slug,
    title:        row.title,
    department:   row.department,
    location:     row.location,
    type:         row.type,
    experience:   row.experience,
    featured:     row.featured,
    about:        row.about,
    responsibilities: parseJsonField(row.responsibilities),
    requirements:     parseJsonField(row.requirements),
    niceToHave:       parseJsonField(row.niceToHave),
    skills:           parseJsonField(row.skills),
    benefits:         parseJsonField(row.benefits),
    salaryRange:  row.salaryRange,
    deadline:     row.deadline,
    applicationQuestions: parseJsonField(row.applicationQuestions),
    seoTitle:     row.seoTitle,
    seoDescription: row.seoDescription,
    status:       row.status,
    publishedAt:  row.publishedAt,
    publishedBy:  row.publishedBy,
    updatedBy:    row.updatedBy,
    postedDaysAgo,
    createdAt:    row.createdAt,
    updatedAt:    row.updatedAt,
  };
}

/* ── Seed data ───────────────────────────────────────────────────────── */
const SEED_JOBS: NewJob[] = [
  {
    slug: "senior-software-engineer", title: "Senior Software Engineer",
    department: "Engineering", location: "Accra / Hybrid", type: "Full Time", experience: "Senior",
    about: "Lead the development of Esoko's core agricultural technology platform, building scalable APIs and mobile-first applications used by millions of farmers across Africa.",
    responsibilities: JSON.stringify(["Design and implement scalable backend services using Node.js and TypeScript","Build and maintain real-time data pipelines for agricultural market information","Collaborate with mobile engineers to deliver offline-capable farmer applications","Conduct code reviews and mentor junior engineers","Work closely with product managers to translate requirements into technical solutions","Contribute to infrastructure decisions around cloud architecture on AWS/GCP"]),
    requirements: JSON.stringify(["Bachelor's degree in Computer Science, Software Engineering, or related field","5+ years of professional software engineering experience","Strong proficiency in TypeScript, React, and Node.js","Experience with relational databases (PostgreSQL) and caching layers (Redis)","Demonstrated ability to build and maintain production-grade systems"]),
    niceToHave: JSON.stringify(["Experience with mobile development (React Native / Expo)","Familiarity with agricultural technology or development-sector projects","Knowledge of offline-first architecture patterns","Open source contributions"]),
    skills: JSON.stringify(["TypeScript","React","Node.js","PostgreSQL","AWS","Redis"]),
    benefits: JSON.stringify(["Competitive salary","Health insurance","Learning budget","Flexible working","Remote options"]),
    deadline: "September 30, 2026", status: "Published",
  },
  {
    slug: "ai-ml-engineer", title: "AI / ML Engineer",
    department: "Engineering", location: "Accra / Remote", type: "Full Time", experience: "Senior",
    about: "Join the AI team to build predictive models for crop yield forecasting, satellite image analysis, and automated agronomic advisory that improves livelihoods across Africa.",
    responsibilities: JSON.stringify(["Develop and deploy ML models for crop disease detection and yield prediction","Build pipelines to process satellite imagery from Sentinel-2 and Landsat sources","Design automated agronomic advisory systems using NLP and LLMs","Collaborate with data engineers to build robust feature stores and training datasets","Evaluate model performance against real-world agricultural outcomes"]),
    requirements: JSON.stringify(["MSc or PhD in Machine Learning, Computer Science, or related field","3+ years of hands-on ML engineering in production environments","Strong Python skills with PyTorch or TensorFlow","Experience with MLOps: model versioning, CI/CD, and serving at scale"]),
    niceToHave: JSON.stringify(["Experience with geospatial data (GDAL, rasterio, GEE)","Published research in agriculture AI or climate-related machine learning","Familiarity with multi-lingual NLP for African languages"]),
    skills: JSON.stringify(["Python","PyTorch","TensorFlow","GCP","MLOps","SQL"]),
    benefits: JSON.stringify(["Competitive salary","Conference budget","Research time","Health insurance","Flexible working"]),
    deadline: "October 15, 2026", status: "Published",
  },
  {
    slug: "product-manager-data", title: "Product Manager — Data & Analytics",
    department: "Product", location: "Accra, Ghana", type: "Full Time", experience: "Mid Level",
    about: "Drive the roadmap for Esoko's data and analytics products, working at the intersection of agronomy, technology, and user experience.",
    responsibilities: JSON.stringify(["Own the product vision and roadmap for analytics dashboards and reporting tools","Conduct deep user research with field teams and NGO programme managers","Write detailed product specifications and user stories for engineering teams","Define KPIs, run A/B tests, and measure product impact","Partner with the go-to-market team to launch data products to enterprise clients"]),
    requirements: JSON.stringify(["3+ years of product management experience at a software or data company","Strong analytical skills — comfortable with SQL and data visualisation tools","Proven ability to manage cross-functional stakeholders and ship products on time"]),
    niceToHave: JSON.stringify(["Background in agriculture, development economics, or environmental science","Experience with GIS or geospatial data products"]),
    skills: JSON.stringify(["Product Strategy","SQL","Figma","Data Analysis","Stakeholder Management"]),
    benefits: JSON.stringify(["Competitive salary","Health insurance","Learning budget","Team events"]),
    deadline: "September 20, 2026", status: "Published",
  },
  {
    slug: "field-operations-manager", title: "Field Operations Manager",
    department: "Operations", location: "Accra / Northern Ghana", type: "Full Time", experience: "Mid Level",
    about: "Manage the deployment of Esoko's field data collection programmes across farming communities in Ghana and West Africa.",
    responsibilities: JSON.stringify(["Oversee field agent recruitment, training, and performance management","Coordinate logistics for large-scale farmer registration and survey programmes","Monitor data quality and implement corrective actions in real time","Build relationships with local agricultural extension officers and community leaders","Report programme outcomes to international development partners and government clients"]),
    requirements: JSON.stringify(["4+ years of field operations experience in development, agriculture, or related sectors","Experience managing distributed teams across rural and remote areas","Strong project management and data analysis skills","Fluency in English and at least one Ghanaian language"]),
    niceToHave: JSON.stringify(["Experience with mobile data collection tools (ODK, KoBoCollect, or similar)","Familiarity with M&E frameworks used by USAID, World Bank, or GIZ"]),
    skills: JSON.stringify(["Programme Management","Field Data Collection","Team Leadership","Reporting"]),
    benefits: JSON.stringify(["Competitive salary","Health insurance","Transport allowance","Paid leave"]),
    deadline: "October 5, 2026", status: "Published",
  },
  {
    slug: "agronomy-specialist", title: "Agronomy Specialist",
    department: "Agriculture", location: "Accra, Ghana", type: "Full Time", experience: "Mid Level",
    about: "Provide expert agronomic knowledge to power Esoko's digital advisory content and AI models, translating agriculture science into practical guidance for millions of farmers.",
    responsibilities: JSON.stringify(["Develop and validate agronomic content for major staple and cash crops","Work with the AI team to build training datasets for crop disease identification","Collaborate with content teams to produce farmer-facing advisories in local languages","Engage directly with farmers, cooperatives, and extension agents to validate recommendations"]),
    requirements: JSON.stringify(["BSc or MSc in Agronomy, Crop Science, or related agricultural discipline","4+ years of practical agronomy experience in sub-Saharan Africa","Deep knowledge of smallholder farming systems, soil management, and integrated pest management"]),
    niceToHave: JSON.stringify(["Experience with precision agriculture or digital extension services","Knowledge of climate-smart agriculture and carbon sequestration practices"]),
    skills: JSON.stringify(["Agronomy","Crop Science","IPM","Soil Science","Remote Sensing"]),
    benefits: JSON.stringify(["Competitive salary","Health insurance","Field allowance","Professional development"]),
    deadline: "September 25, 2026", status: "Published",
  },
  {
    slug: "frontend-engineer", title: "Frontend Engineer",
    department: "Engineering", location: "Accra / Remote", type: "Full Time", experience: "Mid Level",
    about: "Build beautiful, performant web interfaces for Esoko's enterprise platform and farmer-facing applications used daily by governments, NGOs, and agricultural businesses.",
    responsibilities: JSON.stringify(["Build responsive, accessible UI components using React and TypeScript","Develop data-rich dashboards for field programme monitoring and analytics","Implement design systems and maintain visual consistency across products","Optimise front-end performance for low-bandwidth environments in rural Africa"]),
    requirements: JSON.stringify(["3+ years of professional frontend development experience","Strong proficiency in React, TypeScript, and modern CSS","Experience with data visualisation libraries (Recharts, D3, or similar)","Understanding of web accessibility standards (WCAG 2.1)"]),
    niceToHave: JSON.stringify(["Experience with React Native or Expo for cross-platform mobile development","Familiarity with offline-first PWA patterns"]),
    skills: JSON.stringify(["React","TypeScript","Tailwind CSS","Framer Motion","GraphQL"]),
    benefits: JSON.stringify(["Competitive salary","Remote options","Equipment budget","Health insurance"]),
    deadline: "October 10, 2026", status: "Published",
  },
  {
    slug: "marketing-manager", title: "Marketing Manager",
    department: "Marketing", location: "Accra, Ghana", type: "Full Time", experience: "Senior",
    about: "Lead Esoko's marketing efforts to build brand authority, generate enterprise leads, and position the company as Africa's most innovative agricultural technology company.",
    responsibilities: JSON.stringify(["Develop and execute integrated marketing campaigns across digital and offline channels","Manage content marketing, SEO, social media, and email programmes","Coordinate flagship events including the annual Esoko AgriTech Summit","Build relationships with pan-African agricultural media and thought leaders"]),
    requirements: JSON.stringify(["5+ years of B2B marketing experience, ideally in technology or development sectors","Proven track record in demand generation and enterprise brand building","Strong written communication skills for thought-leadership content"]),
    niceToHave: JSON.stringify(["Experience marketing to government or NGO audiences","Network within the African agritech or development-finance ecosystem"]),
    skills: JSON.stringify(["B2B Marketing","Content Strategy","SEO","HubSpot","Campaign Management"]),
    benefits: JSON.stringify(["Competitive salary","Health insurance","Conference budget","Flexible working"]),
    deadline: "October 1, 2026", status: "Published",
  },
  {
    slug: "data-scientist", title: "Data Scientist",
    department: "Engineering", location: "Accra / Remote", type: "Full Time", experience: "Mid Level",
    about: "Extract insights from Esoko's rich agricultural datasets to power strategic decisions and build data products for clients.",
    responsibilities: JSON.stringify(["Analyse large-scale agricultural datasets to identify patterns and opportunities","Build statistical models for crop price forecasting and food security assessments","Create compelling data visualisations and reports for government and donor audiences","Maintain and document data dictionaries and analytical methodologies"]),
    requirements: JSON.stringify(["MSc in Data Science, Statistics, Economics, or related quantitative field","2+ years of data analysis or data science experience","Proficiency in Python or R for statistical analysis and modelling","Strong SQL skills for working with large relational datasets"]),
    niceToHave: JSON.stringify(["Experience with geospatial analysis (PostGIS, QGIS, or Python geospatial stack)","Background in food systems, development economics, or climate data"]),
    skills: JSON.stringify(["Python","R","SQL","Pandas","Scikit-learn","Power BI"]),
    benefits: JSON.stringify(["Competitive salary","Learning budget","Remote options","Health insurance"]),
    deadline: "October 20, 2026", status: "Published",
  },
];

async function seedJobsIfEmpty() {
  try {
    const existing = await db.select({ id: jobsTable.id }).from(jobsTable).limit(1);
    if (existing.length > 0) return;
    await db.insert(jobsTable).values(SEED_JOBS);
    logger.info("Jobs table seeded with initial data");
  } catch (err) {
    logger.error({ err }, "Failed to seed jobs table");
  }
}
seedJobsIfEmpty();

/* ── Zod schemas ─────────────────────────────────────────────────────── */
const ALL_STAGES = [
  "Applied","Review","Leadership",
  "New","Screening","Shortlisted","Interview","Assessment",
  "Offer","Hired","Rejected","Withdrawn",
] as const;
type ApplicationStage = typeof ALL_STAGES[number];

const jobCreateSchema = z.object({
  slug:          z.string().min(2).max(100),
  title:         z.string().min(2).max(200),
  department:    z.enum(["Engineering","Product","Agriculture","Operations","Marketing","Finance","HR"]),
  location:      z.string().min(2).max(200),
  type:          z.enum(["Full Time","Contract","Internship","Graduate"]),
  experience:    z.enum(["Entry Level","Mid Level","Senior","Leadership"]),
  featured:      z.boolean().default(false),
  about:         z.string().min(10),
  responsibilities:     z.array(z.string()).default([]),
  requirements:         z.array(z.string()).default([]),
  niceToHave:           z.array(z.string()).default([]),
  skills:               z.array(z.string()).default([]),
  benefits:             z.array(z.string()).default([]),
  salaryRange:          z.string().optional(),
  deadline:             z.string().default(""),
  applicationQuestions: z.array(z.string()).default([]),
  seoTitle:             z.string().max(120).optional(),
  seoDescription:       z.string().max(320).optional(),
  status:               z.enum(["Draft","Published","Closed"]).default("Draft"),
});

/* ══════════════════════════════════════════════════════════════════════
   PUBLIC ENDPOINTS
   ═══════════════════════════════════════════════════════════════════════ */

/* GET /api/jobs ─────────────────────────────────────────────────────── */
router.get("/jobs", async (req, res) => {
  try {
    const { department, type, experience, location: locFilter } = req.query;
    const rows = await db.select().from(jobsTable);
    const filtered = rows.filter(row => {
      if (row.status !== "Published") return false;
      if (department && row.department !== department) return false;
      if (type && row.type !== type) return false;
      if (experience && row.experience !== experience) return false;
      if (locFilter) {
        const loc = String(locFilter).toLowerCase();
        if (loc === "remote" && !row.location.toLowerCase().includes("remote")) return false;
        if (loc === "ghana" && !row.location.toLowerCase().includes("accra") && !row.location.toLowerCase().includes("ghana")) return false;
      }
      return true;
    });
    res.json({ jobs: filtered.map(toJobResponse) });
  } catch (err) {
    logger.error({ err }, "GET /jobs failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* GET /api/jobs/:id ─────────────────────────────────────────────────── */
router.get("/jobs/:id", async (req, res) => {
  try {
    const id = req.params['id'] as string;
    const isNumeric = /^\d+$/.test(id);
    const rows = await db.select().from(jobsTable)
      .where(isNumeric ? eq(jobsTable.id, parseInt(id)) : eq(jobsTable.slug, id));
    if (rows.length === 0 || rows[0].status !== "Published") {
      res.status(404).json({ error: "Job not found" });
      return;
    }
    res.json({ job: toJobResponse(rows[0]) });
  } catch (err) {
    logger.error({ err }, "GET /jobs/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* POST /api/jobs/:id/apply ──────────────────────────────────────────── */
router.post("/jobs/:id/apply", upload.single("cv"), async (req, res) => {
  try {
    const id = req.params['id'] as string;
    const isNumeric = /^\d+$/.test(id);
    const rows = await db.select({ id: jobsTable.id, status: jobsTable.status })
      .from(jobsTable)
      .where(isNumeric ? eq(jobsTable.id, parseInt(id)) : eq(jobsTable.slug, id));
    if (rows.length === 0 || rows[0].status !== "Published") {
      res.status(404).json({ error: "Job not found or not accepting applications" });
      return;
    }
    const { name, email, phone, coverLetter, answers: answersRaw } = req.body as Record<string, string>;
    if (!name || !email) {
      res.status(400).json({ error: "Name and email are required" });
      return;
    }
    let answersJson = "[]";
    if (answersRaw) {
      let parsed: unknown;
      try { parsed = JSON.parse(answersRaw); } catch {
        res.status(400).json({ error: "answers must be valid JSON" }); return;
      }
      if (!Array.isArray(parsed)) {
        res.status(400).json({ error: "answers must be a JSON array" }); return;
      }
      if (parsed.length > 20) {
        res.status(400).json({ error: "answers array exceeds maximum of 20 items" }); return;
      }
      const validated: { question: string; answer: string }[] = [];
      for (const item of parsed) {
        if (item === null || typeof item !== "object" || Array.isArray(item)) {
          res.status(400).json({ error: "each answer must be an object with question and answer strings" }); return;
        }
        const q = (item as Record<string, unknown>)["question"];
        const a = (item as Record<string, unknown>)["answer"];
        if (typeof q !== "string" || typeof a !== "string") {
          res.status(400).json({ error: "each answer.question and answer.answer must be a string" }); return;
        }
        validated.push({ question: q.slice(0, 500), answer: a.slice(0, 2000) });
      }
      answersJson = JSON.stringify(validated);
    }
    let cvFileUrl: string | undefined;
    if (req.file) {
      cvFileUrl = await uploadCvToGcs(req.file.buffer, req.file.mimetype);
    }
    const newApp: NewApplication = {
      jobId: rows[0].id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      coverLetter: coverLetter?.trim() || null,
      cvFileUrl: cvFileUrl ?? null,
      answers: answersJson,
      stage: "New",
    };
    const [inserted] = await db.insert(applicationsTable).values(newApp).returning({ id: applicationsTable.id });
    res.status(201).json({ id: inserted.id, message: "Application submitted successfully. We will be in touch soon." });
  } catch (err) {
    logger.error({ err }, "POST /jobs/:id/apply failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ══════════════════════════════════════════════════════════════════════
   ADMIN ENDPOINTS (HR_ADMIN or SUPER_ADMIN)
   ═══════════════════════════════════════════════════════════════════════ */

/* GET /api/jobs/admin/all ───────────────────────────────────────────── */
router.get("/jobs/admin/all", requireRole("SUPER_ADMIN","HR_ADMIN"), async (req, res) => {
  try {
    const { status: statusFilter } = req.query;
    let rows = await db.select().from(jobsTable).orderBy(sql`${jobsTable.createdAt} DESC`);
    if (statusFilter && ["Draft","Published","Closed"].includes(String(statusFilter))) {
      rows = rows.filter(r => r.status === statusFilter);
    }
    res.json({ jobs: rows.map(toJobResponse) });
  } catch (err) {
    logger.error({ err }, "GET /jobs/admin/all failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* GET /api/jobs/admin/all-applications ─────────────────────────────── */
// Search by name/email, filter by jobId and/or stage.
// Uses DB COUNT(*) + LIMIT/OFFSET — no in-memory materialisation.
router.get("/jobs/admin/all-applications", requireRole("SUPER_ADMIN","HR_ADMIN"), async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(String(req.query['page'] ?? "1")));
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query['limit'] ?? "20"))));
    const offset = (page - 1) * limit;
    const search      = String(req.query['search'] ?? "").trim();
    const jobIdFilter = req.query['jobId'] ? parseInt(String(req.query['jobId'])) : null;
    const stageFilter = req.query['stage'] ? String(req.query['stage']) : null;

    // Build shared WHERE clause
    const conditions = [];
    if (jobIdFilter) conditions.push(eq(applicationsTable.jobId, jobIdFilter));
    if (stageFilter && (ALL_STAGES as readonly string[]).includes(stageFilter)) {
      conditions.push(eq(applicationsTable.stage, stageFilter as ApplicationStage));
    }
    if (search) {
      conditions.push(or(
        ilike(applicationsTable.name, `%${search}%`),
        ilike(applicationsTable.email, `%${search}%`),
      )!);
    }
    const whereClause = conditions.length === 0 ? undefined
      : conditions.length === 1 ? conditions[0]
      : and(...conditions);

    // 1. DB COUNT — no JOIN needed, faster
    const countQuery = db.select({ total: count() }).from(applicationsTable).$dynamic();
    const [{ total }] = await (whereClause ? countQuery.where(whereClause) : countQuery);

    // 2. Data page — JOIN for job title/slug, DB LIMIT/OFFSET
    let dataQuery = db.select({
      app:      applicationsTable,
      jobTitle: jobsTable.title,
      jobSlug:  jobsTable.slug,
    })
    .from(applicationsTable)
    .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
    .$dynamic();

    if (whereClause) dataQuery = dataQuery.where(whereClause);
    const rows = await dataQuery
      .orderBy(sql`${applicationsTable.createdAt} DESC`)
      .limit(limit)
      .offset(offset);

    res.json({
      applications: rows.map(r => ({ ...r.app, jobTitle: r.jobTitle, jobSlug: r.jobSlug })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    logger.error({ err }, "GET /jobs/admin/all-applications failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* GET /api/jobs/admin/:id/applications ─────────────────────────────── */
router.get("/jobs/admin/:id/applications", requireRole("SUPER_ADMIN","HR_ADMIN"), async (req, res) => {
  try {
    const id = req.params['id'] as string;
    const isNumeric = /^\d+$/.test(id);
    const jobRows = await db.select({ id: jobsTable.id }).from(jobsTable)
      .where(isNumeric ? eq(jobsTable.id, parseInt(id)) : eq(jobsTable.slug, id));
    if (jobRows.length === 0) { res.status(404).json({ error: "Job not found" }); return; }

    const search      = String(req.query['search'] ?? "").trim();
    const stageFilter = req.query['stage'] ? String(req.query['stage']) : null;

    const baseConditions = [eq(applicationsTable.jobId, jobRows[0].id)];
    if (stageFilter && (ALL_STAGES as readonly string[]).includes(stageFilter)) {
      baseConditions.push(eq(applicationsTable.stage, stageFilter as ApplicationStage));
    }

    const whereClause = search
      ? and(
          and(...baseConditions),
          or(
            ilike(applicationsTable.name, `%${search}%`),
            ilike(applicationsTable.email, `%${search}%`),
          )!,
        )
      : and(...baseConditions);

    const apps = await db.select().from(applicationsTable)
      .where(whereClause)
      .orderBy(sql`${applicationsTable.createdAt} DESC`);
    res.json({ applications: apps });
  } catch (err) {
    logger.error({ err }, "GET /jobs/admin/:id/applications failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* GET /api/jobs/admin/applications/:id/cv ───────────────────────────── */
router.get("/jobs/admin/applications/:id/cv", requireRole("SUPER_ADMIN","HR_ADMIN"), async (req, res) => {
  try {
    const appId = parseInt(req.params['id'] as string);
    const rows = await db.select({
      cvFileUrl: applicationsTable.cvFileUrl,
      name: applicationsTable.name,
    }).from(applicationsTable).where(eq(applicationsTable.id, appId));
    if (rows.length === 0 || !rows[0].cvFileUrl) {
      res.status(404).json({ error: "No CV attached to this application" });
      return;
    }
    const file = await objectStorageService.getObjectEntityFile(rows[0].cvFileUrl);
    const download = await objectStorageService.downloadObject(file, 0);
    const safeName = rows[0].name.replace(/[^a-zA-Z0-9\s]/g, "").trim().replace(/\s+/g, "-");
    res.setHeader("Content-Disposition", `attachment; filename="cv-${safeName}.pdf"`);
    download.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "content-disposition") res.setHeader(key, value);
    });
    res.status(download.status);
    if (download.body) {
      const { Readable } = await import("stream");
      Readable.fromWeb(download.body as import("stream/web").ReadableStream).pipe(res);
    } else {
      res.end();
    }
  } catch (err) {
    logger.error({ err }, "GET /jobs/admin/applications/:id/cv failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* GET /api/jobs/admin/applications/:id/notes ───────────────────────── */
router.get("/jobs/admin/applications/:id/notes", requireRole("SUPER_ADMIN","HR_ADMIN"), async (req, res) => {
  try {
    const appId = parseInt(req.params['id'] as string);
    const notes = await db
      .select({
        id:        applicationNotesTable.id,
        body:      applicationNotesTable.body,
        createdAt: applicationNotesTable.createdAt,
        authorId:  applicationNotesTable.authorId,
      })
      .from(applicationNotesTable)
      .where(eq(applicationNotesTable.applicationId, appId))
      .orderBy(sql`${applicationNotesTable.createdAt} DESC`);
    res.json({ notes });
  } catch (err) {
    logger.error({ err }, "GET /jobs/admin/applications/:id/notes failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* POST /api/jobs/admin/applications/:id/notes ──────────────────────── */
router.post("/jobs/admin/applications/:id/notes", requireRole("SUPER_ADMIN","HR_ADMIN"), async (req, res) => {
  try {
    const appId = parseInt(req.params['id'] as string);
    const { body } = z.object({ body: z.string().min(1).max(4000) }).parse(req.body);

    // Verify application exists
    const appRows = await db.select({ id: applicationsTable.id })
      .from(applicationsTable).where(eq(applicationsTable.id, appId));
    if (appRows.length === 0) { res.status(404).json({ error: "Application not found" }); return; }

    const [note] = await db.insert(applicationNotesTable).values({
      applicationId: appId,
      authorId: req.user?.id ?? null,
      body,
    }).returning();

    audit({
      userId: req.user?.id ?? null,
      action: "application_note_added",
      entityType: "application",
      entityId: appId,
      ip: req.ip,
    });

    res.status(201).json({ note });
  } catch (err) {
    logger.error({ err }, "POST /jobs/admin/applications/:id/notes failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* POST /api/jobs ────────────────────────────────────────────────────── */
router.post("/jobs", requireRole("SUPER_ADMIN","HR_ADMIN"), async (req, res) => {
  const parsed = jobCreateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() }); return; }
  try {
    const {
      responsibilities, requirements, niceToHave, skills, benefits,
      applicationQuestions, featured, seoTitle, seoDescription, ...rest
    } = parsed.data;
    const now = new Date();
    const publishedAt = rest.status === "Published" ? now : null;
    const publishedBy = rest.status === "Published" ? (req.user?.id ?? null) : null;
    const [row] = await db.insert(jobsTable).values({
      ...rest,
      featured,
      seoTitle:     seoTitle ?? null,
      seoDescription: seoDescription ?? null,
      responsibilities: JSON.stringify(responsibilities),
      requirements: JSON.stringify(requirements),
      niceToHave: JSON.stringify(niceToHave),
      skills: JSON.stringify(skills),
      benefits: JSON.stringify(benefits),
      applicationQuestions: JSON.stringify(applicationQuestions),
      publishedAt,
      publishedBy,
    }).returning();
    res.status(201).json({ job: toJobResponse(row) });
  } catch (err) {
    logger.error({ err }, "POST /jobs failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* PUT /api/jobs/:id ─────────────────────────────────────────────────── */
router.put("/jobs/:id", requireRole("SUPER_ADMIN","HR_ADMIN"), async (req, res) => {
  const parsed = jobCreateSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() }); return; }
  try {
    const id = req.params['id'] as string;
    const isNumeric = /^\d+$/.test(id);
    const {
      responsibilities, requirements, niceToHave, skills, benefits,
      applicationQuestions, seoTitle, seoDescription, status, featured, ...rest
    } = parsed.data;
    const updates: Partial<typeof jobsTable.$inferInsert> = {
      ...rest,
      updatedAt: new Date(),
      updatedBy: req.user?.id ?? null,
    };
    if (featured !== undefined) updates.featured = featured;
    if (seoTitle !== undefined) updates.seoTitle = seoTitle ?? null;
    if (seoDescription !== undefined) updates.seoDescription = seoDescription ?? null;
    if (responsibilities !== undefined) updates.responsibilities = JSON.stringify(responsibilities);
    if (requirements !== undefined) updates.requirements = JSON.stringify(requirements);
    if (niceToHave !== undefined) updates.niceToHave = JSON.stringify(niceToHave);
    if (skills !== undefined) updates.skills = JSON.stringify(skills);
    if (benefits !== undefined) updates.benefits = JSON.stringify(benefits);
    if (applicationQuestions !== undefined) updates.applicationQuestions = JSON.stringify(applicationQuestions);

    // Auto-set publishedAt / publishedBy when status changes to Published
    if (status !== undefined) {
      updates.status = status;
      if (status === "Published") {
        // Fetch current publishedAt to avoid overwriting an existing timestamp
        const existing = await db.select({ publishedAt: jobsTable.publishedAt })
          .from(jobsTable)
          .where(isNumeric ? eq(jobsTable.id, parseInt(id)) : eq(jobsTable.slug, id));
        if (existing.length > 0 && !existing[0].publishedAt) {
          updates.publishedAt = new Date();
          updates.publishedBy = req.user?.id ?? null;
        }
      }
    }

    const rows = await db.update(jobsTable).set(updates)
      .where(isNumeric ? eq(jobsTable.id, parseInt(id)) : eq(jobsTable.slug, id))
      .returning();
    if (rows.length === 0) { res.status(404).json({ error: "Job not found" }); return; }
    res.json({ job: toJobResponse(rows[0]) });
  } catch (err) {
    logger.error({ err }, "PUT /jobs/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* DELETE /api/jobs/:id (archive) ────────────────────────────────────── */
router.delete("/jobs/:id", requireRole("SUPER_ADMIN","HR_ADMIN"), async (req, res) => {
  try {
    const id = req.params['id'] as string;
    const isNumeric = /^\d+$/.test(id);
    const rows = await db.update(jobsTable)
      .set({ status: "Closed", updatedAt: new Date(), updatedBy: req.user?.id ?? null })
      .where(isNumeric ? eq(jobsTable.id, parseInt(id)) : eq(jobsTable.slug, id))
      .returning({ id: jobsTable.id });
    if (rows.length === 0) { res.status(404).json({ error: "Job not found" }); return; }
    res.json({ message: "Job archived (status set to Closed)", id: rows[0].id });
  } catch (err) {
    logger.error({ err }, "DELETE /jobs/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* PATCH /api/jobs/admin/applications/:id/stage ─────────────────────── */
router.patch("/jobs/admin/applications/:id/stage", requireRole("SUPER_ADMIN","HR_ADMIN"), async (req, res) => {
  try {
    const appId = parseInt(req.params['id'] as string);
    const stageSchema = z.enum(ALL_STAGES);
    const { stage } = z.object({ stage: stageSchema }).parse(req.body);
    const rows = await db.update(applicationsTable)
      .set({ stage })
      .where(eq(applicationsTable.id, appId))
      .returning();
    if (rows.length === 0) { res.status(404).json({ error: "Application not found" }); return; }
    audit({
      userId: req.user?.id ?? null,
      action: "application_stage_changed",
      entityType: "application",
      entityId: appId,
      metadata: { stage },
      ip: req.ip,
    });
    res.json({ application: rows[0] });
  } catch (err) {
    logger.error({ err }, "PATCH /jobs/admin/applications/:id/stage failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as jobsRouter };
export default router;
