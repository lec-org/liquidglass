import type { CSSProperties, HTMLAttributes, JSX } from "react";
import { cx } from "./internal/cx";

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  shape?: "text" | "circle" | "rounded";
  animated?: boolean;
}

/** 仅提供视觉占位；在内容容器设置 aria-busy，并提供一条加载说明，避免逐条播报。 */
export function Skeleton({
  width,
  height,
  shape = "text",
  animated = true,
  className,
  style,
  ...props
}: SkeletonProps): JSX.Element {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={cx("lg-skeleton", className)}
      data-shape={shape}
      data-animated={animated || undefined}
      style={{ ...style, width, height }}
    />
  );
}
