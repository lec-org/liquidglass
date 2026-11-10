import {
  forwardRef,
  useId,
  useRef,
  type ForwardRefExoticComponent,
  type InputHTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";
import { useRefraction } from "./internal/refraction";

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "children"
> {
  children?: ReactNode;
  description?: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
}

/** 同组 Radio 使用相同 name，浏览器负责互斥选择、方向键导航和表单提交。 */
export const Radio: ForwardRefExoticComponent<
  RadioProps & RefAttributes<HTMLInputElement>
> = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    children,
    description,
    onCheckedChange,
    onChange,
    className,
    style,
    ...props
  },
  ref,
) {
  const surface = useRef<HTMLSpanElement>(null);
  const descriptionId = useId();
  useRefraction(surface);
  return (
    <label
      className={cx("lg-choice", className)}
      style={style}
      data-disabled={props.disabled || undefined}
    >
      <input
        {...props}
        ref={ref}
        type="radio"
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
        className="lg-glass lg-choice-control lg-radio-control"
        aria-hidden="true"
      >
        <span />
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
