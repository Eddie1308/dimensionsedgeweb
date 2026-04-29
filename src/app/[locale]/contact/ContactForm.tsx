"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { contactSubmissionSchema } from "@/lib/validators/contact";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm " +
  "text-[var(--color-ink)] placeholder:text-[var(--color-ink-subtle)] " +
  "transition-colors focus:border-[var(--color-brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-200)]";

const labelClasses =
  "mb-1.5 block text-sm font-medium text-[var(--color-ink)]";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const parsed = contactSubmissionSchema.safeParse(payload);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0]);
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] p-8 text-center">
        <CheckCircle2
          className="mx-auto h-10 w-10 text-[var(--color-brand-600)]"
          aria-hidden="true"
        />
        <h3 className="mt-4 text-xl font-semibold text-[var(--color-brand-950)]">
          {t("successTitle")}
        </h3>
        <p className="mt-2 text-[var(--color-ink-muted)]">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={t("name")}
          name="name"
          required
          error={errors.name}
          requiredLabel={t("required")}
        />
        <Field
          label={t("email")}
          name="email"
          type="email"
          required
          error={errors.email}
          requiredLabel={t("required")}
        />
        <Field label={t("phone")} name="phone" type="tel" />
        <Field label={t("company")} name="company" />
      </div>
      <Field label={t("subject")} name="subject" />
      <div>
        <label htmlFor="message" className={labelClasses}>
          {t("message")} <span className="text-[var(--color-brand-600)]">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className={cn(inputClasses, "resize-y")}
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-red-600">{errors.message}</p>
        )}
      </div>

      {status === "error" && (
        <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <div>
            <p className="font-semibold">{t("errorTitle")}</p>
            <p className="mt-1">{t("errorBody")}</p>
          </div>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting"}
        className="w-full sm:w-auto"
      >
        {status === "submitting" ? (
          t("submitting")
        ) : (
          <>
            <Send className="h-4 w-4" />
            {t("submit")}
          </>
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  requiredLabel,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  requiredLabel?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClasses}>
        {label}
        {required && (
          <span className="ms-1 text-[var(--color-brand-600)]" aria-label={requiredLabel}>
            *
          </span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className={inputClasses}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
