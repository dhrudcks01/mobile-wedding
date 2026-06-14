import type { ComponentPropsWithoutRef, ReactNode } from "react";

type SectionAlign = "center" | "left";

export type SectionProps = ComponentPropsWithoutRef<"section"> & {
  align?: SectionAlign;
  children?: ReactNode;
  description?: string;
  eyebrow?: string;
  title?: string;
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function Section({
  align = "center",
  children,
  className,
  description,
  eyebrow,
  title,
  ...sectionProps
}: SectionProps) {
  const alignmentClassName = align === "center" ? "text-center" : "text-left";

  return (
    <section
      className={joinClassNames("w-full px-6 py-16", className)}
      {...sectionProps}
    >
      <div className={joinClassNames("mx-auto max-w-sm", alignmentClassName)}>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h2 className="mt-4 text-2xl font-semibold leading-tight text-[var(--color-text)]">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
