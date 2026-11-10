import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { useControllable } from "./internal/controllable";
import { cx } from "./internal/cx";
import { FieldError } from "./internal/field-error";
import { useFormReset } from "./internal/form-reset";
import { useRefraction } from "./internal/refraction";

export interface TextAreaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "defaultValue"
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: "glass" | "fill";
  showCount?: boolean;
  /** 默认不显示原生缩放手柄，保持玻璃边缘完整；需要拖拽时显式开启。 */
  resize?: "none" | "vertical" | "both";
  /** 业务校验错误，覆盖原生约束校验生成的行内提示。 */
  error?: ReactNode;
}

export const TextArea: ForwardRefExoticComponent<
  TextAreaProps & RefAttributes<HTMLTextAreaElement>
> = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    value: controlled,
    defaultValue = "",
    onValueChange,
    onChange,
    onInvalid,
    error: customError,
    variant = "glass",
    showCount = false,
    resize = "none",
    className,
    style,
    rows = 4,
    ...props
  },
  ref,
) {
  const surface = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const countId = useId();
  const errorId = `${countId}-error`;
  const [validationError, setValidationError] = useState<string>();
  const error = customError ?? validationError;
  const [value, setValue] = useControllable(
    controlled,
    defaultValue,
    onValueChange,
  );
  useImperativeHandle(ref, () => input.current!);
  useRefraction(surface);
  useFormReset(input, () => {
    setValidationError(undefined);
    if (controlled === undefined) setValue(defaultValue);
  });
  useEffect(() => {
    if (input.current?.validity.valid) setValidationError(undefined);
  }, [value, props.disabled, props.required]);
  return (
    <div className={cx("lg-textarea-field", className)} style={style}>
      <div
        ref={surface}
        className="lg-glass lg-textarea"
        data-variant={variant}
        data-disabled={props.disabled || undefined}
        data-invalid={
          Boolean(error) ||
          props["aria-invalid"] === true ||
          props["aria-invalid"] === "true" ||
          undefined
        }
      >
        <textarea
          {...props}
          ref={input}
          rows={rows}
          value={value}
          style={{ resize }}
          aria-describedby={
            [
              props["aria-describedby"],
              showCount ? countId : null,
              error ? errorId : null,
            ]
              .filter(Boolean)
              .join(" ") || undefined
          }
          aria-invalid={error ? true : props["aria-invalid"]}
          onInvalid={(event) => {
            onInvalid?.(event);
            if (event.defaultPrevented) return;
            // 只取消浏览器气泡；原生约束校验仍会阻止无效表单提交。
            event.preventDefault();
            setValidationError(
              event.currentTarget.validity.valueMissing
                ? "请填写内容后再提交。"
                : event.currentTarget.validationMessage,
            );
            input.current?.focus();
          }}
          onChange={(event) => {
            setValue(event.currentTarget.value);
            onChange?.(event);
          }}
        />
        {showCount && (
          <span id={countId} className="lg-textarea-count">
            {value.length}
            {props.maxLength == null ? "" : ` / ${props.maxLength}`}
          </span>
        )}
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
});
