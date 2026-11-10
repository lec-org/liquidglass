import { useRef, type HTMLAttributes, type JSX, type ReactNode } from "react";
import { cx } from "./internal/cx";
import { useRefraction } from "./internal/refraction";

export type TagTone = "neutral" | "info" | "success" | "warning" | "danger";
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone;
  icon?: ReactNode;
  /** 传入后显示关闭按钮；列表删除由调用方完成，组件不自行隐藏。 */
  onClose?: () => void;
  closeLabel?: string;
}

export function Tag({
  tone = "neutral",
  icon,
  onClose,
  closeLabel = "移除标签",
  children,
  className,
  ...props
}: TagProps): JSX.Element {
  const ref = useRef<HTMLSpanElement>(null);
  useRefraction(ref);
  return (
    <span
      {...props}
      ref={ref}
      className={cx("lg-glass lg-tag", className)}
      data-tone={tone}
    >
      {icon}
      <span>{children}</span>
      {onClose && (
        <button
          type="button"
          className="lg-dismiss"
          aria-label={closeLabel}
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </span>
  );
}
