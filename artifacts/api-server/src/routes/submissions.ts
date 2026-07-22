import { Router, type IRouter } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import { demoRequestsTable, contactSubmissionsTable } from "@workspace/db";

const router: IRouter = Router();

const demoRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  organization: z.string().min(2, "Organization must be at least 2 characters").max(200),
  country: z.string().min(2, "Please select a country").max(100),
  useCase: z.string().min(2, "Please select a use case").max(1000),
});

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(2, "Subject must be at least 2 characters").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

router.post("/demo-requests", async (req, res) => {
  const result = demoRequestSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Validation failed", details: result.error.flatten() });
    return;
  }

  try {
    const [row] = await db
      .insert(demoRequestsTable)
      .values(result.data)
      .returning({ id: demoRequestsTable.id });

    res.status(201).json({ id: row.id, message: "Demo request submitted successfully" });
  } catch (err) {
    console.error("Failed to save demo request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/contact", async (req, res) => {
  const result = contactSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Validation failed", details: result.error.flatten() });
    return;
  }

  try {
    const [row] = await db
      .insert(contactSubmissionsTable)
      .values(result.data)
      .returning({ id: contactSubmissionsTable.id });

    res.status(201).json({ id: row.id, message: "Message sent successfully" });
  } catch (err) {
    console.error("Failed to save contact submission:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
