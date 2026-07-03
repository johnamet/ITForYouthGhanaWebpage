"use client";

import { FormEvent, useState } from "react";
import clsx from "clsx";

type NewsletterSignupFormProps = {
  variant?: "compact" | "full";
  interest?: string;
  buttonLabel?: string;
  placeholder?: string;
  className?: string;
};

type SubmitState = {
  type: "idle" | "success" | "error";
  message: string;
};

export function NewsletterSignupForm({
  variant = "full",
  interest,
  buttonLabel = "Subscribe",
  placeholder = "Your email address",
  className,
}: NewsletterSignupFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({
    type: "idle",
    message: "",
  });

  const isCompact = variant === "compact";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setSubmitState({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          interest,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Something went wrong while subscribing.");
      }

      setEmail("");
      setSubmitState({
        type: "success",
        message: payload.message || "You’re subscribed. Watch your inbox for updates.",
      });
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not process your signup right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={clsx("w-full", className)}>
      <form
        onSubmit={handleSubmit}
        className={clsx(
          "flex w-full gap-3",
          isCompact
            ? "max-w-sm flex-col sm:flex-row"
            : "mx-auto max-w-2xl flex-col sm:flex-row",
        )}
      >
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={placeholder}
          className={clsx(
            "w-full rounded-full border outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20",
            isCompact
              ? "border-white/35 bg-white/10 px-4 py-2.5 text-[0.8rem] text-white placeholder:text-white/65"
              : "border-white/12 bg-white px-5 py-4 text-sm text-brand-ink placeholder:text-slate-400",
          )}
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={clsx(
            "shrink-0 font-bold disabled:cursor-not-allowed disabled:opacity-60",
            isCompact
              ? "itfy-button-outline-pink px-5 py-2.5 text-[0.75rem]"
              : "itfy-button-primary px-7 py-4 text-sm",
          )}
        >
          {isSubmitting ? "Submitting..." : buttonLabel}
        </button>
      </form>

      <p
        aria-live="polite"
        className={clsx(
          "mt-3 text-sm",
          isCompact ? "text-white/55" : "text-center text-white/70",
          submitState.type === "success" &&
            (isCompact ? "text-emerald-300" : "text-emerald-200"),
          submitState.type === "error" && (isCompact ? "text-rose-300" : "text-rose-200"),
        )}
      >
        {submitState.message}
      </p>
    </div>
  );
}
