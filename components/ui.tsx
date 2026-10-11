import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check } from "@/components/icons";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  icon = true,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light" | "text";
  className?: string;
  icon?: boolean;
}) {
  return (
    <Link className={`button button--${variant} ${className}`} href={href}>
      <span>{children}</span>{icon && <ArrowRight size={16} aria-hidden="true" />}
    </Link>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow"><span className="eyebrow__rule" />{eyebrow}</p>
        <h2>{title}</h2>
        {description && <p className="section-heading__copy">{description}</p>}
      </div>
      {link && <Link className="text-link section-heading__link" href={link.href}>{link.label}<ArrowRight size={16} aria-hidden="true" /></Link>}
    </div>
  );
}

export function StatusMessage({ children, kind = "success" }: { children: ReactNode; kind?: "success" | "error" | "info" }) {
  return <p className={`status-message status-message--${kind}`} role="status">{kind === "success" && <Check size={16} aria-hidden="true" />}{children}</p>;
}

export function FormField({
  label,
  id,
  hint,
  error,
  children,
}: {
  label: string;
  id: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && <small className="field-hint">{hint}</small>}
      {error && <small className="field-error" id={`${id}-error`}>{error}</small>}
    </div>
  );
}
