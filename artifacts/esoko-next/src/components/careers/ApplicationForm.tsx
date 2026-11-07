"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { submitApplication, validateApplication, CV_TYPES, CV_MAX_BYTES, type ApplicationInput } from "@/lib/careers";

const ANSWER_MAX = 2000;
const CV_MB = Math.round(CV_MAX_BYTES / (1024 * 1024));

export default function ApplicationForm({ jobId, questions }: { jobId: string; questions: string[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [answers, setAnswers] = useState<string[]>(() => questions.map(() => ""));
  const [cv, setCv] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const inFlight = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;
    setError(null);
    setSuccess("");
    if (answers.some(a => a.length > ANSWER_MAX)) {
      setError(`Each answer must be ${ANSWER_MAX} characters or fewer.`);
      return;
    }
    const input: ApplicationInput = { name, email, phone, coverLetter, questions, answers, cv };
    const invalid = validateApplication(input);
    if (invalid) { setError(invalid); return; }
    inFlight.current = true;
    setSubmitting(true);
    try {
      const message = await submitApplication(jobId, input);
      setName(""); setEmail(""); setPhone(""); setCoverLetter("");
      setAnswers(questions.map(() => "")); setCv(null);
      if (fileRef.current) fileRef.current.value = "";
      setSuccess(message);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Submission failed. Please try again.");
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return <form className="cs-form" method="post" action={`/api/jobs/${encodeURIComponent(jobId)}/apply`}
    encType="multipart/form-data" onSubmit={onSubmit} aria-busy={submitting}>
    <noscript>Please enable JavaScript to submit an application and its custom answers.</noscript>
    <div className="cs-error" role="alert">{error}</div>
    <div className="cs-success" role="status" aria-live="polite">{success}</div>
    <div className="cs-form-row">
      <label className="cs-input">Full name *
        <input required name="name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} disabled={submitting} />
      </label>
      <label className="cs-input">Email address *
        <input required type="email" name="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} disabled={submitting} />
      </label>
    </div>
    <label className="cs-input">Phone number <small>(optional)</small>
      <input type="tel" name="phone" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} disabled={submitting} />
    </label>
    <label className="cs-input">Cover letter <small>(optional)</small>
      <textarea name="coverLetter" rows={5} value={coverLetter} onChange={e => setCoverLetter(e.target.value)} disabled={submitting} />
    </label>
    {questions.length > 0 && <input type="hidden" name="answers"
      value={JSON.stringify(questions.map((question, i) => ({ question, answer: answers[i] ?? "" })))} />}
    {questions.map((q, i) => <label className="cs-input" key={i}>{q} <small>(optional, max {ANSWER_MAX} characters)</small>
      <textarea rows={3} maxLength={ANSWER_MAX} value={answers[i] ?? ""} disabled={submitting}
        onChange={e => { const v = e.target.value; setAnswers(prev => { const a = [...prev]; a[i] = v; return a; }); }} />
    </label>)}
    <label className="cs-input">CV / Résumé <small>(optional; PDF or Word, max {CV_MB} MB)</small>
      <input ref={fileRef} type="file" name="cv" disabled={submitting}
        accept={`.pdf,.doc,.docx,${CV_TYPES.join(",")}`}
        onChange={e => setCv(e.target.files?.[0] ?? null)} />
    </label>
    <div><button type="submit" className="cs-btn" disabled={!ready || submitting}>{submitting ? "Submitting…" : "Submit application"}</button></div>
  </form>;
}
