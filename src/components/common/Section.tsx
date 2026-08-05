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
      className={joinClassNames(
        "w-full px-6 py-24 text-[var(--section-text,var(--color-text))]",
        className,
      )}
      {...sectionProps}
    >
      <div className={joinClassNames("mx-auto max-w-sm", alignmentClassName)}>
        {eyebrow || title || description ? (
          <div data-reveal="fade-up" data-reveal-duration="1100">
            {eyebrow ? (
              <span className="font-title-en inline-flex min-h-7 items-center justify-center rounded-full border border-[var(--section-line,var(--color-line))] px-3 text-[10px] italic tracking-[0.08em] text-[var(--section-muted,var(--color-text-muted))]">
                {eyebrow}
              </span>
            ) : null}
            {title ? (
              <h2 className="section-title mt-3 text-[var(--section-text,var(--color-text))]">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-5 whitespace-pre-line text-[13px] leading-7 text-[var(--section-muted,var(--color-text-muted))]">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
