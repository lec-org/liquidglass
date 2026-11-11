/** 列表筛选操作区，由页面持有查询条件并处理提交和重置。 */
import type { FormHTMLAttributes, JSX, ReactNode } from "react";
import { useConfig } from "./config-provider";
import { Button } from "./button";
import { cx } from "./internal/cx";

export interface FilterBarProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  onClear?: () => void;
  clearLabel?: string;
  actions?: ReactNode;
}
export function FilterBar({
  children,
  onClear,
  clearLabel,
  actions,
  className,
  ...props
}: FilterBarProps): JSX.Element {
  const { locale } = useConfig();
  return (
    <form
      {...props}
      className={cx("lg-filter-bar", className)}
      onSubmit={(event) => {
        if (props.onSubmit) props.onSubmit(event);
        else event.preventDefault();
      }}
    >
      <div className="lg-filter-fields">{children}</div>
      <div className="lg-filter-actions">
        {onClear && (
          <Button type="button" size="small" onClick={onClear}>
            {clearLabel ?? locale.resetFilters}
          </Button>
        )}
        {actions}
      </div>
    </form>
  );
}
