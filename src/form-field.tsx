/** 表单项布局与可访问性关联，可接入原生表单或任意表单状态库。 */
import { useId, type HTMLAttributes, type JSX, type ReactNode } from "react";
import { cx } from "./internal/cx";

export interface FieldControlProps {
  id: string;
  required?: boolean;
  disabled?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
}
export interface FormFieldProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  id?: string;
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  children: (props: FieldControlProps) => ReactNode;
}
export function FormField({
  id,
  label,
  description,
  error,
  required,
  disabled,
  children,
  className,
  ...props
}: FormFieldProps): JSX.Element {
  const generated = useId();
  const controlId = id ?? generated;
  const descriptionId = description ? controlId + "-description" : undefined;
  const errorId = error ? controlId + "-error" : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div
      {...props}
      className={cx("lg-field", className)}
      data-disabled={disabled || undefined}
    >
      <label htmlFor={controlId} className="lg-field-label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {description && (
        <div id={descriptionId} className="lg-field-description">
          {description}
        </div>
      )}
      {children({
        id: controlId,
        required,
        disabled,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}
      {error && (
        <div id={errorId} className="lg-field-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
