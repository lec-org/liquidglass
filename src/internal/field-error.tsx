import type { JSX, ReactNode } from "react";

/** 与输入关联的行内错误，不使用浏览器无法换肤的校验气泡。 */
export function FieldError({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <span id={id} role="alert" className="lg-field-error">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="6" />
        <path d="M8 4.5v4M8 11h.01" />
      </svg>
      <span>{children}</span>
    </span>
  );
}
