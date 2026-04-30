import Link from "next/link";
import type { ReactNode } from "react";

type AppButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
};

export function AppButton({
  children,
  href,
  variant = "primary",
  type = "button",
  disabled = false,
}: AppButtonProps) {
  const className = `eapa-button ${
    variant === "secondary"
      ? "eapa-button-secondary"
      : variant === "ghost"
        ? "eapa-button-ghost"
        : ""
  }`;

  if (href) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} disabled={disabled} type={type}>
      {children}
    </button>
  );
}
