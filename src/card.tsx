import {
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react";
import { Glass } from "./glass";
import { cx } from "./internal/cx";

export interface CardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title?: ReactNode;
  description?: ReactNode;
  extra?: ReactNode;
  cover?: ReactNode;
  footer?: ReactNode;
  padding?: "small" | "regular" | "large";
}

export const Card: ForwardRefExoticComponent<
  CardProps & RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    title,
    description,
    extra,
    cover,
    footer,
    padding = "regular",
    children,
    className,
    ...props
  },
  ref,
) {
  return (
    <Glass
      {...props}
      ref={ref}
      className={cx("lg-card", className)}
      data-padding={padding}
    >
      {cover != null && <div className="lg-card-cover">{cover}</div>}
      {(title != null || description != null || extra != null) && (
        <div className="lg-card-header">
          <div className="lg-card-heading">
            {title != null && <div className="lg-card-title">{title}</div>}
            {description != null && (
              <div className="lg-card-description">{description}</div>
            )}
          </div>
          {extra != null && <div className="lg-card-extra">{extra}</div>}
        </div>
      )}
      <div className="lg-card-body">{children}</div>
      {footer != null && <div className="lg-card-footer">{footer}</div>}
    </Glass>
  );
});
