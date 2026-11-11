/** 日期范围浮层的月份导航，复用玻璃按钮并交给 DayPicker 管理月份边界。 */
import type { NavProps } from "@daypicker/react";
import type { JSX } from "react";
import { Button } from "../button";
import { useConfig } from "../config-provider";
import { Chevron } from "./chevron";

export interface RangeCalendarNavigationProps extends NavProps {}
export function RangeCalendarNavigation({
  previousMonth,
  nextMonth,
  onPreviousClick,
  onNextClick,
  ...props
}: RangeCalendarNavigationProps): JSX.Element {
  const { locale } = useConfig();
  return (
    <nav {...props} aria-label={locale.dateRange}>
      <Button
        size="small"
        icon={<Chevron direction="previous" />}
        aria-label={locale.previousMonth}
        disabled={!previousMonth}
        onClick={onPreviousClick}
      />
      <Button
        size="small"
        icon={<Chevron direction="next" />}
        aria-label={locale.nextMonth}
        disabled={!nextMonth}
        onClick={onNextClick}
      />
    </nav>
  );
}
