/** Public API fields only; never import the database or static seeded vacancies. */
export interface PublicJob {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  featured: boolean;
  about: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  skills: string[];
  benefits: string[];
  salaryRange: string | null;
  deadline: string;
  applicationQuestions: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const CV_TYPES = [
  "application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const CV_MAX_BYTES = 5 * 1024 * 1024;
export interface ApplicationInput {
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
  questions: string[];
  answers: string[];
  cv: File | null;
}

export function validateApplication(input: ApplicationInput): string | null {
  if (!input.name.trim()) return "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) return "Please enter a valid email address.";
  if (input.cv && !CV_TYPES.includes(input.cv.type)) return "Please upload a PDF or Word document (.pdf, .doc, .docx).";
  if (input.cv && input.cv.size > CV_MAX_BYTES) return "Your CV must be no larger than 5 MB.";
  if (input.questions.length > 20) return "This vacancy's application questions need to be reviewed by Esoko.";
  if (input.answers.some(a => a.length > 2000)) {
    return "Please keep each application answer within 2,000 characters.";
  }
  return null;
}

export function applicationData(input: ApplicationInput): FormData {
  const error = validateApplication(input);
  if (error) throw new Error(error);
  const data = new FormData();
  data.set("name", input.name.trim());
  data.set("email", input.email.trim());
  if (input.phone.trim()) data.set("phone", input.phone.trim());
  if (input.coverLetter.trim()) data.set("coverLetter", input.coverLetter.trim());
  if (input.cv) data.set("cv", input.cv);
  if (input.questions.length) data.set("answers", JSON.stringify(
    input.questions.map((question, i) => ({ question, answer: input.answers[i] ?? "" })),
  ));
  return data;
}

export async function submitApplication(
  id: string, input: ApplicationInput, fetcher: typeof fetch = fetch,
): Promise<string> {
  const response = await fetcher(`/api/jobs/${encodeURIComponent(id)}/apply`, {
    method: "POST", body: applicationData(input),
  });
  const result: unknown = await response.json().catch(() => null);
  const data = result && typeof result === "object" ? result as Record<string, unknown> : {};
  if (!response.ok) {
    throw new Error(typeof data.error === "string" ? data.error : `Application could not be submitted (HTTP ${response.status}).`);
  }
  if (response.status !== 201 || typeof data.id !== "number" || typeof data.message !== "string") {
    throw new Error("The server returned an unexpected confirmation. Contact Esoko before submitting again.");
  }
  return data.message;
}

export function deadlineDate(value: string): string | null {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const text = /^([A-Za-z]+) (\d{1,2}), (\d{4})$/.exec(value);
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? value :
    text && months.includes(text[1]) ? `${text[3]}-${String(months.indexOf(text[1]) + 1).padStart(2, "0")}-${text[2].padStart(2, "0")}` : "";
  if (!iso) return null;
  const date = new Date(`${iso}T23:59:59Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === iso ? iso : null;
}

export function jobIsExpired(job: Pick<PublicJob, "deadline">, now = Date.now()): boolean {
  const date = deadlineDate(job.deadline);
  return date !== null && now > Date.parse(`${date}T23:59:59Z`);
}
