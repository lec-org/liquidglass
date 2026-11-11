/** 详情页的只读字段展示，使用 dl/dt/dd 保持标签和值的语义。 */
import { useId, type CSSProperties, type JSX, type ReactNode } from "react";
import { cx } from "./internal/cx";

export interface DescriptionItem {
  key: string;
  label: ReactNode;
  value: ReactNode;
}
export interface DescriptionsProps {
  items: readonly DescriptionItem[];
  columns?: 1 | 2 | 3;
  className?: string;
}
export function Descriptions({
  items,
  columns = 2,
  className,
}: DescriptionsProps): JSX.Element {
  const id = useId();
  return (
    <dl
      className={cx("lg-descriptions", className)}
      style={{ "--lg-description-columns": columns } as CSSProperties}
    >
      {items.map((item, index) => (
        <div key={item.key}>
          <dt id={id + "-" + index}>{item.label}</dt>
          <dd aria-labelledby={id + "-" + index}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
