import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type ForwardRefExoticComponent,
  type InputHTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";
import { useRefraction } from "./internal/refraction";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "children"
> {
  children?: ReactNode;
  description?: ReactNode;
  /** 半选状态独立于 checked，适合“全选”；由调用方根据子项计算。 */
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox: ForwardRefExoticComponent<
  CheckboxProps & RefAttributes<HTMLInputElement>
> = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    children,
    description,
    indeterminate = false,
    onCheckedChange,
    onChange,
    className,
    style,
    ...props
  },
  forwardedRef,
) {
  const input = useRef<HTMLInputElement>(null);
  const surface = useRef<HTMLSpanElement>(null);
  const descriptionId = useId();
  useImperativeHandle(forwardedRef, () => input.current!);
  useRefraction(surface);
  useEffect(() => {
    if (input.current) input.current.indeterminate = indeterminate;
  }, [indeterminate, props.checked]);
  return (
    <label
      className={cx("lg-choice", className)}
      style={style}
      data-disabled={props.disabled || undefined}
    >
      {/* 保留真实 input，让表单提交、required、空格键和非受控 reset 由浏览器处理。 */}
      <input
        {...props}
        ref={input}
        type="checkbox"
        className="lg-choice-input"
        aria-describedby={
          [props["aria-describedby"], description ? descriptionId : null]
            .filter(Boolean)
            .join(" ") || undefined
        }
        onChange={(event) => {
          onChange?.(event);
          onCheckedChange?.(event.currentTarget.checked);
        }}
      />
      <span
        ref={surface}
        className="lg-glass lg-choice-control"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path className="lg-choice-check" d="m5 10 3.2 3.2L15 6.5" />
          <path className="lg-choice-mixed" d="M5 10h10" />
        </svg>
      </span>
      {(children != null || description != null) && (
        <span className="lg-choice-text">
          <span>{children}</span>
          {description != null && (
            <span id={descriptionId} className="lg-choice-description">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
});
