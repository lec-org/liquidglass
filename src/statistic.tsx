/** 看板中的单个指标，业务计算、单位换算与格式化由调用方提供。 */
import type { JSX, ReactNode } from "react";

export interface StatisticProps {
  title: ReactNode;
  value: string | number;
  formatter?: (value: string | number) => ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  description?: ReactNode;
}
export function Statistic({
  title,
  value,
  formatter,
  prefix,
  suffix,
  description,
}: StatisticProps): JSX.Element {
  return (
    <div className="lg-statistic">
      <div className="lg-muted">{title}</div>
      <div className="lg-statistic-value">
        {prefix}
        {formatter ? formatter(value) : value}
        {suffix && <small>{suffix}</small>}
      </div>
      {description && <div className="lg-muted">{description}</div>}
    </div>
  );
}
