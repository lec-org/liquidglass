import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ForwardRefExoticComponent,
  type KeyboardEvent,
  type ReactNode,
  type RefAttributes,
  type SelectHTMLAttributes,
} from "react";
import { useControllable } from "./internal/controllable";
import { cx } from "./internal/cx";
import { FieldError } from "./internal/field-error";
import { Floating } from "./internal/floating";
import { useFormReset } from "./internal/form-reset";
import { useRefraction } from "./internal/refraction";

export interface SelectOption {
  /** 非空、唯一的值；空字符串保留给 placeholder。 */
  value: string;
  label: string;
  disabled?: boolean;
}
export interface SelectProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "defaultValue" | "onChange" | "children" | "type" | "onInvalid"
> {
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  onInvalid?: SelectHTMLAttributes<HTMLSelectElement>["onInvalid"];
  /** 业务校验错误，覆盖原生必填校验的行内提示。 */
  error?: ReactNode;
}

export const Select: ForwardRefExoticComponent<
  SelectProps & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    options,
    value: controlled,
    defaultValue = "",
    onValueChange,
    placeholder = "请选择",
    className,
    style,
    id,
    disabled,
    required,
    name,
    form,
    onInvalid,
    onClick,
    onKeyDown,
    autoComplete,
    error: customError,
    ...props
  },
  forwardedRef,
) {
  const anchor = useRef<HTMLButtonElement>(null);
  const native = useRef<HTMLSelectElement>(null);
  const [value, setValue] = useControllable(
    controlled,
    defaultValue,
    onValueChange,
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const errorId = `${listId}-error`;
  const [validationError, setValidationError] = useState<string>();
  const error = customError ?? validationError;
  const typeahead = useRef({ text: "", at: 0 });
  useRefraction(anchor);
  useFormReset(native, () => {
    setOpen(false);
    setValidationError(undefined);
    if (controlled === undefined) setValue(defaultValue);
  });
  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);
  useEffect(() => {
    if (native.current?.validity.valid) setValidationError(undefined);
  }, [value, disabled, required]);
  useEffect(() => {
    if (open && active >= 0)
      document
        .getElementById(`${listId}-${active}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [open, active, listId]);
  const selected = options.findIndex((option) => option.value === value);
  const enabled = options
    .map((option, index) => (option.disabled ? -1 : index))
    .filter((index) => index >= 0);
  const show = (last = false) => {
    setActive(
      enabled.includes(selected)
        ? selected
        : ((last ? enabled.at(-1) : enabled[0]) ?? -1),
    );
    setOpen(true);
  };
  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    setValue(option.value);
    setOpen(false);
  };
  const keyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const key = event.key;
    if (key === "Tab") {
      setOpen(false);
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) {
      event.preventDefault();
      if (!open) {
        show(key === "ArrowUp" || key === "End");
        return;
      }
      const position = enabled.indexOf(active);
      const index =
        key === "Home"
          ? 0
          : key === "End"
            ? enabled.length - 1
            : (position + (key === "ArrowDown" ? 1 : -1) + enabled.length) %
              enabled.length;
      setActive(enabled[index] ?? -1);
    } else if (key === "Enter" || key === " ") {
      event.preventDefault();
      if (open) choose(active);
      else show();
    } else if (
      key.length === 1 &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      event.preventDefault();
      const now = Date.now();
      const text =
        (now - typeahead.current.at > 600 ? "" : typeahead.current.text) +
        key.toLocaleLowerCase();
      typeahead.current = { text, at: now };
      const match = enabled.find((index) =>
        options[index]!.label.toLocaleLowerCase().startsWith(text),
      );
      if (match !== undefined) {
        setOpen(true);
        setActive(match);
      }
    }
  };
  return (
    <span className={cx("lg-select", className)} style={style}>
      {/* 原生 select 承担 FormData / required / reset；可见按钮和 listbox 承担玻璃样式与键盘选择。 */}
      <select
        ref={native}
        className="lg-visually-hidden"
        tabIndex={-1}
        aria-hidden="true"
        name={name}
        form={form}
        autoComplete={autoComplete}
        disabled={disabled}
        required={required}
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        onInvalid={(event) => {
          onInvalid?.(event);
          if (event.defaultPrevented) return;
          event.preventDefault();
          setValidationError(
            event.currentTarget.validity.valueMissing
              ? "请选择一个选项。"
              : event.currentTarget.validationMessage,
          );
          anchor.current?.focus();
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      <button
        {...props}
        ref={(element) => {
          anchor.current = element;
          if (typeof forwardedRef === "function") forwardedRef(element);
          else if (forwardedRef) forwardedRef.current = element;
        }}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={
          open && active >= 0 ? `${listId}-${active}` : undefined
        }
        aria-required={required}
        aria-label={props["aria-label"]}
        aria-labelledby={props["aria-labelledby"]}
        aria-describedby={
          [props["aria-describedby"], error ? errorId : null]
            .filter(Boolean)
            .join(" ") || undefined
        }
        aria-invalid={error ? true : props["aria-invalid"]}
        disabled={disabled}
        className="lg-glass lg-select-trigger"
        data-placeholder={selected < 0 || undefined}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          if (open) setOpen(false);
          else show();
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (!event.defaultPrevented) keyDown(event);
        }}
      >
        <span>{selected < 0 ? placeholder : options[selected]!.label}</span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>
      {error && <FieldError id={errorId}>{error}</FieldError>}
      {open && (
        <Floating
          id={listId}
          anchor={anchor}
          role="listbox"
          aria-label={props["aria-label"]}
          aria-labelledby={props["aria-labelledby"]}
          align="start"
          className="lg-select-list"
          style={{ width: anchor.current?.offsetWidth }}
          onDismiss={() => setOpen(false)}
        >
          {options.length === 0 && (
            <div className="lg-select-empty" role="presentation">
              暂无选项
            </div>
          )}
          {options.map((option, index) => (
            <div
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              className="lg-select-option"
              data-active={active === index || undefined}
              onPointerMove={() => {
                if (!option.disabled) setActive(index);
              }}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              <span aria-hidden="true">
                {option.value === value ? "✓" : ""}
              </span>
            </div>
          ))}
        </Floating>
      )}
    </span>
  );
});
