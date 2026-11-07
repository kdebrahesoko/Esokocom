import { z } from "zod";

/** Client validation mirrors the unchanged submissions API, including its maxima. */
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(2, "Subject must be at least 2 characters").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});
export const demoRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  organization: z.string().min(2, "Organization must be at least 2 characters").max(200),
  country: z.string().min(2, "Please select a country").max(100),
  useCase: z.string().min(2, "Please select a use case").max(1000),
});
export type ContactInput = z.infer<typeof contactSchema>;
export type DemoRequestInput = z.infer<typeof demoRequestSchema>;
export type FormKind = "contact" | "demo";
export type FieldErrors = Record<string, string>;
export type SubmissionReceipt = { id: number; message: string };
const schemas = { contact: contactSchema, demo: demoRequestSchema };
const endpoints = { contact: "/api/contact", demo: "/api/demo-requests" };

export function validatePublicForm(kind: FormKind, input: unknown): FieldErrors {
  const parsed = schemas[kind].safeParse(input);
  if (parsed.success) return {};
  const errors: FieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = String(issue.path[0] ?? "");
    errors[field] ??= issue.message;
  }
  return errors;
}

export class PublicFormError extends Error {
  fieldErrors: FieldErrors;
  constructor(message: string, fieldErrors: FieldErrors = {}) {
    super(message);
    this.name = "PublicFormError";
    this.fieldErrors = fieldErrors;
  }
}

/** No Server Action or server-side API duplication: browser -> existing /api. */
export async function submitPublicForm(
  kind: FormKind, input: unknown, fetcher: typeof fetch = fetch,
): Promise<SubmissionReceipt> {
  const parsed = schemas[kind].safeParse(input);
  if (!parsed.success) throw new PublicFormError("Please check the highlighted fields.", validatePublicForm(kind, input));
  const response = await fetcher(endpoints[kind], {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });
  const value: unknown = await response.json().catch(() => null);
  const body = value && typeof value === "object" ? value as Record<string, unknown> : {};
  if (!response.ok) {
    const fieldErrors: FieldErrors = {};
    const details = body.details as { fieldErrors?: Record<string, unknown> } | undefined;
    for (const [field, messages] of Object.entries(details?.fieldErrors ?? {})) {
      if (Array.isArray(messages) && typeof messages[0] === "string") fieldErrors[field] = messages[0];
    }
    throw new PublicFormError(typeof body.error === "string" ? body.error : `Submission failed (HTTP ${response.status}). Please try again.`, fieldErrors);
  }
  if (response.status !== 201 || !Number.isSafeInteger(body.id) || Number(body.id) < 1 ||
      typeof body.message !== "string" || !body.message) {
    throw new PublicFormError("The server returned an unexpected confirmation. Contact Esoko before submitting again.");
  }
  return { id: Number(body.id), message: body.message };
}

export const DEMO_COUNTRIES = [
  "Ghana", "Nigeria", "Kenya", "Ethiopia", "Tanzania", "Uganda", "Rwanda",
  "Côte d'Ivoire", "Senegal", "Cameroon", "Mozambique", "Zambia", "Zimbabwe",
  "Mali", "Burkina Faso", "Niger", "Sudan", "South Sudan", "Somalia",
  "Madagascar", "Malawi", "Angola", "Other",
];
export const DEMO_USE_CASES = [
  "Farmer registration & profiling", "Field data collection & surveys",
  "Agricultural extension & advisory", "Supply chain traceability", "Market linkages",
  "Financial inclusion (credit/insurance)", "Government programme management",
  "NGO/development project M&E", "Sustainability & carbon tracking", "Other",
];
