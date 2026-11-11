/** 范围日历适配层，复用 DayPicker 的日期与键盘逻辑，视觉由组件库自己的样式控制。 */
import { useEffect, useState, type JSX } from "react";
import {
  DayPicker,
  getDefaultClassNames,
  type ClassNames,
  type DateRange,
  type Matcher,
} from "@daypicker/react";
import { zhCN, enUS } from "@daypicker/react/locale";
import { useConfig } from "../config-provider";
import { formatDateOnly, parseDateOnly } from "./date-only";
import { RangeCalendarNavigation } from "./range-calendar-navigation";

const classNames = Object.fromEntries(
  Object.keys(getDefaultClassNames()).map((key) => [key, "lg-range-" + key]),
) as ClassNames;
export interface RangeCalendarProps {
  value?: DateRange;
  onValueChange: (value: DateRange | undefined) => void;
  min?: string;
  max?: string;
  today?: string;
}
export function RangeCalendar({
  value,
  onValueChange,
  min,
  max,
  today,
}: RangeCalendarProps): JSX.Element {
  const { locale, direction } = useConfig();
  const [months, setMonths] = useState(2);
  useEffect(() => {
    const media = matchMedia("(max-width: 640px)");
    const update = () => setMonths(media.matches ? 1 : 2);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const lower = parseDateOnly(min),
    upper = parseDateOnly(max);
  const disabled: Matcher[] = [];
  if (lower) disabled.push({ before: lower });
  if (upper) disabled.push({ after: upper });
  return (
    <DayPicker
      mode="range"
      resetOnSelect
      selected={value}
      onSelect={onValueChange}
      defaultMonth={value?.from ?? lower ?? parseDateOnly(today)}
      today={parseDateOnly(today)}
      startMonth={lower ?? parseDateOnly("1000-01-01")}
      endMonth={upper ?? parseDateOnly("9999-12-31")}
      numberOfMonths={months}
      weekStartsOn={1}
      fixedWeeks
      showOutsideDays={false}
      autoFocus
      locale={locale.languageTag.startsWith("zh") ? zhCN : enUS}
      dir={direction}
      disabled={disabled}
      classNames={classNames}
      components={{ Nav: RangeCalendarNavigation }}
      formatters={{
        formatCaption: (date) =>
          locale.calendarMonth(formatDateOnly(date).slice(0, 7)),
      }}
      labels={{ labelDayButton: (date) => formatDateOnly(date) }}
    />
  );
}
