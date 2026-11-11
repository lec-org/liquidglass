/** 日期范围选择：统一玻璃触发框与日历浮层，业务值始终是日期字符串。 */
import {
  useEffect,
  useId,
  useRef,
  useState,
  type JSX,
  type InvalidEvent,
} from "react";
import type { DateRange as CalendarRange } from "@daypicker/react";
import { Button } from "./button";
import { useConfig } from "./config-provider";
import { useControllable } from "./internal/controllable";
import { useFormReset } from "./internal/form-reset";
import { Floating } from "./internal/floating";
import { FieldError } from "./internal/field-error";
import { RangeCalendar } from "./internal/range-calendar";
import { formatDateOnly, parseDateOnly } from "./internal/date-only";

export interface DateRange {
  start: string;
  end: string;
}
export interface DateRangePickerProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange) => void;
  names?: { start: string; end: string };
  min?: string;
  max?: string;
  /** 由业务按所用时区提供今天，截图或服务端渲染时可传入稳定值。 */
  today?: string;
  required?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}
export function DateRangePicker({
  value,
  defaultValue = { start: "", end: "" },
  onValueChange,
  names,
  min,
  max,
  today,
  required,
  disabled,
  "aria-label": label,
}: DateRangePickerProps): JSX.Element {
  const id = useId();
  const startInput = useRef<HTMLInputElement>(null),
    endInput = useRef<HTMLInputElement>(null);
  const anchor = useRef<HTMLButtonElement>(null);
  const { locale } = useConfig();
  const [range, setRange] = useControllable(value, defaultValue, onValueChange);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CalendarRange>();
  const [error, setError] = useState("");
  const hasValue = Boolean(range.start || range.end);
  const startLabel = range.start
    ? range.start.replaceAll("-", "/")
    : locale.startDate;
  const endLabel = range.end ? range.end.replaceAll("-", "/") : locale.endDate;
  const invalid = Boolean(
    (range.start && !parseDateOnly(range.start)) ||
    (range.end && !parseDateOnly(range.end)) ||
    (range.start && range.end && range.start > range.end) ||
    (min &&
      ((range.start && range.start < min) || (range.end && range.end < min))) ||
    (max &&
      ((range.start && range.start > max) || (range.end && range.end > max))),
  );
  useEffect(() => {
    const message = invalid ? locale.invalidDateRange : "";
    startInput.current?.setCustomValidity(message);
    endInput.current?.setCustomValidity(message);
    if (!invalid && (!required || (range.start && range.end))) setError("");
  }, [invalid, locale.invalidDateRange, range.start, range.end, required]);
  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);
  useFormReset(startInput, () => {
    setOpen(false);
    setError("");
    if (value === undefined) setRange(defaultValue);
  });
  function showCalendar() {
    setDraft({
      from: parseDateOnly(range.start),
      to: parseDateOnly(range.end),
    });
    setOpen(true);
    anchor.current?.focus({ preventScroll: true });
  }
  function closeCalendar() {
    setOpen(false);
    anchor.current?.focus({ preventScroll: true });
  }
  function clear() {
    setRange({ start: "", end: "" });
    setError("");
    closeCalendar();
  }
  function apply() {
    if (!draft?.from || !draft.to) return;
    setRange({
      start: formatDateOnly(draft.from),
      end: formatDateOnly(draft.to),
    });
    setError("");
    closeCalendar();
  }
  function reportInvalid(event: InvalidEvent<HTMLInputElement>) {
    event.preventDefault();
    setError(invalid ? locale.invalidDateRange : locale.requiredDateRange);
    anchor.current?.focus({ preventScroll: true });
  }
  const draftStart = draft?.from
    ? formatDateOnly(draft.from).replaceAll("-", "/")
    : "—";
  const draftEnd = draft?.to
    ? formatDateOnly(draft.to).replaceAll("-", "/")
    : "—";
  return (
    <div
      className="lg-date-range"
      role="group"
      aria-label={label ?? locale.dateRange}
    >
      <div className="lg-date-range-control">
        <Button
          ref={anchor}
          className="lg-date-range-trigger"
          aria-label={label ?? locale.dateRange}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? id : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={id + "-value" + (error ? " " + id + "-error" : "")}
          data-empty={!hasValue || undefined}
          data-clearable={hasValue || undefined}
          disabled={disabled}
          onClick={() => (open ? closeCalendar() : showCalendar())}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="16" rx="3" />
            <path d="M7 3v4m10-4v4M3 11h18" />
          </svg>
          <span>
            {startLabel}
            <span className="lg-date-range-separator" aria-hidden="true">
              –
            </span>
            {endLabel}
          </span>
        </Button>
        {hasValue && (
          <button
            type="button"
            className="lg-dismiss lg-date-range-clear"
            aria-label={locale.clear}
            disabled={disabled}
            onClick={clear}
          >
            ×
          </button>
        )}
      </div>
      <span id={id + "-value"} className="lg-visually-hidden">
        {startLabel} – {endLabel}
      </span>
      {/* 隐藏字段只承担原生表单协议，校验错误交给可见触发框和行内提示。 */}
      <input
        ref={startInput}
        className="lg-visually-hidden"
        tabIndex={-1}
        aria-hidden="true"
        name={names?.start}
        value={range.start}
        required={required}
        disabled={disabled}
        onChange={() => {}}
        onInvalid={reportInvalid}
      />
      <input
        ref={endInput}
        className="lg-visually-hidden"
        tabIndex={-1}
        aria-hidden="true"
        name={names?.end}
        value={range.end}
        required={required}
        disabled={disabled}
        onChange={() => {}}
        onInvalid={reportInvalid}
      />
      {error && <FieldError id={id + "-error"}>{error}</FieldError>}
      {open && (
        <Floating
          id={id}
          anchor={anchor}
          role="dialog"
          aria-label={label ?? locale.dateRange}
          className="lg-range-popover"
          align="start"
          focusOnOpen
          allowAnchorOverlap
          onDismiss={(reason) =>
            reason === "escape" ? closeCalendar() : setOpen(false)
          }
        >
          <div className="lg-range-summary">
            <div>
              <span>{locale.startDate}</span>
              <strong>{draftStart}</strong>
            </div>
            <span className="lg-range-summary-arrow" aria-hidden="true">
              →
            </span>
            <div>
              <span>{locale.endDate}</span>
              <strong>{draftEnd}</strong>
            </div>
          </div>
          <RangeCalendar
            value={draft}
            onValueChange={setDraft}
            min={min}
            max={max}
            today={today}
          />
          <footer className="lg-range-footer">
            <Button size="small" onClick={clear}>
              {locale.clear}
            </Button>
            <div>
              <Button size="small" onClick={closeCalendar}>
                {locale.cancel}
              </Button>
              <Button
                size="small"
                variant="filled"
                disabled={!draft?.from || !draft.to}
                onClick={apply}
              >
                {locale.applyRange}
              </Button>
            </div>
          </footer>
        </Floating>
      )}
    </div>
  );
}
