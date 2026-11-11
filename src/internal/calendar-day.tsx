/** 活动日历的单个日期单元，分开表达日期、活动强度、今天与选中状态。 */
import type { JSX } from "react";

export interface CalendarDayProps {
  date: string;
  label: string;
  level: number;
  selected: boolean;
  today: boolean;
  focusable: boolean;
  onFocus: (date: string) => void;
  onSelect?: (date: string) => void;
}
export function CalendarDay({
  date,
  label,
  level,
  selected,
  today,
  focusable,
  onFocus,
  onSelect,
}: CalendarDayProps): JSX.Element {
  return (
    <div
      role="gridcell"
      aria-selected={date ? selected : undefined}
      className="lg-calendar-cell"
    >
      {date && (
        <button
          type="button"
          data-date={date}
          data-level={level}
          data-today={today || undefined}
          tabIndex={focusable ? 0 : -1}
          disabled={!onSelect}
          aria-label={label}
          aria-current={today ? "date" : undefined}
          onFocus={() => onFocus(date)}
          onClick={() => onSelect?.(date)}
        >
          <span>{Number(date.slice(-2))}</span>
          {level > 0 && (
            <span className="lg-calendar-activity-dot" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}
