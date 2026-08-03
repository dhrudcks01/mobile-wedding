import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "sm";

type ButtonBaseProps = {
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export type ButtonProps = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-[var(--color-button)] text-white shadow-sm hover:bg-[var(--color-button-hover)]",
  secondary:
    "border-[var(--color-line)] bg-white/35 text-[var(--color-text)] hover:bg-white/60",
  ghost:
    "border-transparent bg-transparent text-[var(--color-accent-strong)] hover:bg-black/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-12 px-5 text-sm",
  sm: "min-h-10 px-4 text-xs",
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function Button(props: ButtonProps) {
  const {
    children,
    className,
    size = "md",
    type = "button",
    variant = "primary",
    ...buttonProps
  } = props;

  const buttonClassName = joinClassNames(
    "inline-flex items-center justify-center rounded-full border font-medium tracking-[-0.01em] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-strong)] disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  return (
    <button className={buttonClassName} type={type} {...buttonProps}>
      {children}
    </button>
  );
}
