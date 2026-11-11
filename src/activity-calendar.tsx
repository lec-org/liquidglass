/** 按日期展示活动强度，可用于提交、考勤等数据；日期与统计口径由业务提供。 */
import { useId, useState, type JSX, type KeyboardEvent } from "react";
import { Button } from "./button";
import { useConfig } from "./config-provider";
import { Glass } from "./glass";
import { CalendarDay } from "./internal/calendar-day";
import { Chevron } from "./internal/chevron";

const ACTIVITY_LEVELS = [0, 1, 2, 3, 4];

export interface ActivityDay {
  date: string;
  value: number;
  label?: string;
}
export interface ActivityCalendarProps {
  month: string;
  days: readonly ActivityDay[];
  selectedDate?: string;
  /** 由宿主按业务时区传入今天，避免服务器渲染与浏览器时区不一致。 */
  today?: string;
  onDateSelect?: (date: string) => void;
  onMonthChange?: (month: string) => void;
  "aria-label": string;
}
function datesInMonth(month: string): string[] {
  if (!/^[1-9]\d{3}-(0[1-9]|1[0-2])$/.test(month)) return [];
  const [year, part] = month.split("-").map(Number) as [number, number];
  const count = new Date(Date.UTC(year, part, 0)).getUTCDate();
  return Array.from(
    { length: count },
    (_, index) => month + "-" + String(index + 1).padStart(2, "0"),
  );
}
export function ActivityCalendar({
  month,
  days,
  selectedDate,
  today,
  onDateSelect,
  onMonthChange,
  "aria-label": label,
}: ActivityCalendarProps): JSX.Element {
  const { direction, locale } = useConfig();
  const id = useId();
  const [focus, setFocus] = useState("");
  const dates = datesInMonth(month);
  if (!dates.length) return <p role="alert">月份格式应为 YYYY-MM</p>;
  const first = new Date(dates[0]! + "T12:00:00Z");
  const offset = (first.getUTCDay() + 6) % 7;
  const cells = [...Array.from({ length: offset }, () => ""), ...dates];
  while (cells.length % 7) cells.push("");
  const rows = Array.from({ length: cells.length / 7 }, (_, index) =>
    cells.slice(index * 7, index * 7 + 7),
  );
  const entries = new Map(days.map((day) => [day.date, day]));
  const maximum = Math.max(
    1,
    ...dates.map((date) => {
      const value = entries.get(date)?.value ?? 0;
      return Number.isFinite(value) ? Math.max(0, value) : 0;
    }),
  );
  const active = dates.includes(focus)
    ? focus
    : selectedDate && dates.includes(selectedDate)
      ? selectedDate
      : today && dates.includes(today)
        ? today
        : dates[0];
  const grid = rows.map((row) =>
    row.map((date) => {
      const day = entries.get(date);
      const value = Number.isFinite(day?.value) ? Math.max(0, day!.value) : 0;
      return {
        date,
        level: value ? Math.max(1, Math.ceil((value / maximum) * 4)) : 0,
        label: date + " · " + (day?.label ?? value + " 次活动"),
        selected: selectedDate === date,
        today: today === date,
        focusable: active === date,
      };
    }),
  );
  const activeDays = grid
    .flat()
    .filter((day) => day.date && day.level > 0).length;
  const monthTitle = locale.calendarMonth(month);
  function moveMonth(by: number) {
    const date = new Date(month + "-01T12:00:00Z");
    date.setUTCMonth(date.getUTCMonth() + by);
    const next = date.toISOString().slice(0, 7);
    onMonthChange?.(next);
  }
  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    const at = dates.indexOf((event.target as HTMLElement).dataset.date ?? "");
    if (at === -1) return;
    const step = direction === "rtl" ? -1 : 1;
    const moves: Record<string, number> = {
      ArrowRight: step,
      ArrowLeft: -step,
      ArrowDown: 7,
      ArrowUp: -7,
      Home: -at,
      End: dates.length - at - 1,
    };
    const by = moves[event.key];
    if (by === undefined) return;
    event.preventDefault();
    const date = dates[Math.max(0, Math.min(dates.length - 1, at + by))]!;
    setFocus(date);
    event.currentTarget
      .querySelector<HTMLButtonElement>('[data-date="' + date + '"]')
      ?.focus();
  }
  return (
    <Glass className="lg-activity-calendar">
      <header className="lg-calendar-header">
        <div>
          <p className="lg-calendar-caption">{label}</p>
          <h3 id={id}>{monthTitle}</h3>
        </div>
        <div className="lg-calendar-navigation">
          <Button
            size="small"
            icon={<Chevron direction="previous" />}
            aria-label={locale.previousMonth}
            disabled={!onMonthChange || month === "1000-01"}
            onClick={() => moveMonth(-1)}
          />
          <Button
            size="small"
            icon={<Chevron direction="next" />}
            aria-label={locale.nextMonth}
            disabled={!onMonthChange || month === "9999-12"}
            onClick={() => moveMonth(1)}
          />
        </div>
      </header>
      <div role="grid" aria-label={label + " " + month} onKeyDown={navigate}>
        <div className="lg-calendar-row lg-calendar-weekdays" role="row">
          {locale.weekdays.map((day) => (
            <span key={day} role="columnheader">
              {day}
            </span>
          ))}
        </div>
        {grid.map((row, index) => (
          <div className="lg-calendar-row" role="row" key={index}>
            {row.map((day, column) => (
              <CalendarDay
                key={day.date || "empty-" + column}
                {...day}
                onFocus={setFocus}
                onSelect={onDateSelect}
              />
            ))}
          </div>
        ))}
      </div>
      <footer className="lg-calendar-footer">
        <span>{locale.activeDays(activeDays)}</span>
        <span className="lg-calendar-legend" aria-hidden="true">
          <span>{locale.lessActivity}</span>
          {ACTIVITY_LEVELS.map((level) => (
            <i key={level} data-level={level} />
          ))}
          <span>{locale.moreActivity}</span>
        </span>
      </footer>
    </Glass>
  );
}
