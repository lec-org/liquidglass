/** 通用正文与标题排版，调用方决定文档标题层级。 */
import type { HTMLAttributes, JSX } from "react";
import { cx } from "./internal/cx";

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "label" | "code";
  tone?: "default" | "muted" | "success" | "warning" | "danger";
  size?: "small" | "regular" | "large";
  weight?: "regular" | "medium" | "semibold";
  truncate?: boolean;
  htmlFor?: string;
}
export function Typography({
  as: Tag = "p",
  tone = "default",
  size = "regular",
  weight = "regular",
  truncate,
  className,
  ...props
}: TypographyProps): JSX.Element {
  return (
    <Tag
      {...props}
      className={cx("lg-typography", className)}
      data-tone={tone}
      data-size={size}
      data-weight={weight}
      data-truncate={truncate || undefined}
    />
  );
}
