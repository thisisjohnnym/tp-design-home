"use client";

import { FormEvent, useState } from "react";

const REQUEST_TYPES = [
  "Design partnership",
  "Pattern or component question",
  "Accessibility review",
  "General inquiry",
] as const;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="rule rounded border border-dashed p-6 font-coachtopia text-body text-ink-700 dark:text-ink-200">
        Thanks — your message was captured locally. Wire this form to Slack, Formspree, or an
        internal API in <code className="text-ink-900 dark:text-ink-50">ContactForm.tsx</code> when
        ready.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rule space-y-6 rounded border p-6 md:p-8">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="eyebrow text-ink-500">Name</span>
          <input
            required
            name="name"
            type="text"
            autoComplete="name"
            className="rule rounded border bg-transparent px-4 py-3 font-coachtopia text-body outline-none focus:ring-2 focus:ring-ink-900/20 dark:focus:ring-ink-50/20"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="eyebrow text-ink-500">Email</span>
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            className="rule rounded border bg-transparent px-4 py-3 font-coachtopia text-body outline-none focus:ring-2 focus:ring-ink-900/20 dark:focus:ring-ink-50/20"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="eyebrow text-ink-500">Request type</span>
        <select
          required
          name="requestType"
          className="rule rounded border bg-transparent px-4 py-3 font-coachtopia text-body outline-none focus:ring-2 focus:ring-ink-900/20 dark:focus:ring-ink-50/20"
        >
          {REQUEST_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2">
        <span className="eyebrow text-ink-500">Message</span>
        <textarea
          required
          name="message"
          rows={5}
          className="rule rounded border bg-transparent px-4 py-3 font-coachtopia text-body outline-none focus:ring-2 focus:ring-ink-900/20 dark:focus:ring-ink-50/20"
        />
      </label>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 font-coachtopia text-body-sm font-bold text-ink-50 transition hover:opacity-90 dark:bg-ink-50 dark:text-ink-900"
      >
        Send message
      </button>
    </form>
  );
}
