import type { HTMLAttributes, JSX, ReactNode } from "react";
import { cx } from "./internal/cx";

export interface EmptyProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
}

export function Empty({
  title = "暂无内容",
  description,
  icon,
  children,
  className,
  ...props
}: EmptyProps): JSX.Element {
  return (
    <div {...props} className={cx("lg-empty", className)}>
      <div className="lg-empty-icon" aria-hidden="true">
        {icon ?? (
          <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          >
            <path d="m12 29 9-14h22l9 14v20H12Z" />
            <path d="M12 29h13l3 6h8l3-6h13M24 22h16" />
          </svg>
        )}
      </div>
      <div className="lg-empty-title">{title}</div>
      {description != null && (
        <div className="lg-empty-description">{description}</div>
      )}
      {children != null && <div className="lg-empty-actions">{children}</div>}
    </div>
  );
}
