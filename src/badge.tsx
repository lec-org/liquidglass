import type { HTMLAttributes, JSX, ReactNode } from "react";
import { cx } from "./internal/cx";
import type { TagTone } from "./tag";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  count?: number;
  max?: number;
  dot?: boolean;
  showZero?: boolean;
  tone?: TagTone;
  children?: ReactNode;
  /** 点状徽标应提供描述，例如“有未读消息”。 */
  label?: string;
}

export function Badge({
  count = 0,
  max = 99,
  dot = false,
  showZero = false,
  tone = "danger",
  label,
  children,
  className,
  ...props
}: BadgeProps): JSX.Element {
  const number = Math.max(0, Math.trunc(count));
  const limit = Math.max(0, Math.trunc(max));
  const visible = dot || number > 0 || showZero;
  return (
    <span
      {...props}
      className={cx("lg-badge", className)}
      data-attached={children != null || undefined}
    >
      {children}
      {visible && (
        <span
          role="img"
          className="lg-badge-mark"
          data-tone={tone}
          data-dot={dot || undefined}
          aria-label={label ?? (dot ? "有新消息" : String(number))}
        >
          <span aria-hidden="true">
            {dot ? null : number > limit ? `${limit}+` : number}
          </span>
        </span>
      )}
    </span>
  );
}
