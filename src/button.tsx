import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";
import { usePress } from "./internal/press";
import { useRefraction } from "./internal/refraction";
import { useConfig } from "./config-provider";
import { Spinner } from "./progress";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 等待期间保留按钮名称，阻止重复点击和表单提交。 */
  loading?: boolean;
  /** Shown before the label. On its own, the button is a circle; give it an `aria-label`. */
  icon?: ReactNode;
  /** `glass` is clear; `filled` fills it with the accent colour, for the primary action. */
  variant?: "glass" | "filled";
  /** 统一控件高度：小号 32、常规 40、大号 48px；触屏至少 44px。 */
  size?: "small" | "regular" | "large";
  /** Marks an action that deletes or can't be undone. Shorthand for a red `tint`. */
  destructive?: boolean;
  /** Any CSS colour. Tints a glass button's label, or a filled button's fill. */
  tint?: string;
}

export const Button: ForwardRefExoticComponent<
  ButtonProps & RefAttributes<HTMLButtonElement>
> = /* @__PURE__ */ forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    icon,
    loading = false,
    disabled,
    variant = "glass",
    size: configuredSize,
    destructive,
    tint,
    children,
    className,
    style,
    type = "button",
    ...props
  },
  forwardedRef,
) {
  const { density } = useConfig();
  const size = configuredSize ?? (density === "compact" ? "small" : "regular");
  const ref = useRef<HTMLButtonElement>(null);
  useImperativeHandle(forwardedRef, () => ref.current!);
  usePress(ref);
  useRefraction(ref);

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx("lg-glass lg-button", className)}
      data-icon={icon == null ? undefined : children == null ? "only" : ""}
      data-variant={variant === "glass" ? undefined : variant}
      data-size={size === "regular" ? undefined : size}
      data-destructive={destructive ? "" : undefined}
      data-tint={tint ? "" : undefined}
      style={tint ? ({ ...style, "--lg-tint": tint } as CSSProperties) : style}
      {...props}
    >
      {loading ? <Spinner aria-hidden="true" /> : icon}
      {children}
    </button>
  );
});
