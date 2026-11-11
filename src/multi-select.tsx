/** 可搜索多选，异步搜索由 onSearchChange 通知上层，支持原生 FormData 与 reset。 */
import { useRef, useState, type JSX, type ReactNode } from "react";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Popover } from "./popover";
import { useConfig } from "./config-provider";
import { useControllable } from "./internal/controllable";
import { useFormReset } from "./internal/form-reset";
import { Spinner } from "./progress";

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  group?: string;
  icon?: ReactNode;
}
export interface MultiSelectProps {
  options: readonly MultiSelectOption[];
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (values: string[]) => void;
  onSearchChange?: (search: string) => void;
  placeholder?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  maxSelected?: number;
  "aria-label": string;
}
export function MultiSelect({
  options,
  value,
  defaultValue = [],
  onValueChange,
  onSearchChange,
  placeholder,
  name,
  required,
  disabled,
  loading,
  maxSelected,
  "aria-label": label,
}: MultiSelectProps): JSX.Element {
  const native = useRef<HTMLSelectElement>(null);
  const [selected, setSelected] = useControllable<readonly string[], string[]>(
    value,
    defaultValue,
    onValueChange,
  );
  const [search, setSearch] = useState("");
  const [invalid, setInvalid] = useState(false);
  const { locale } = useConfig();
  useFormReset(native, () => {
    setInvalid(false);
    if (value === undefined) setSelected([...defaultValue]);
  });
  const filtered = onSearchChange
    ? options
    : options.filter((option) =>
        (option.label + " " + (option.description ?? ""))
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase()),
      );
  const selectedLabels = selected.map(
    (key) => options.find((option) => option.value === key)?.label ?? key,
  );
  const groups = [...new Set(filtered.map((option) => option.group ?? ""))];
  return (
    <div className="lg-multi-select">
      <select
        ref={native}
        name={name}
        multiple
        value={[...selected]}
        required={required}
        disabled={disabled}
        className="lg-sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={() => {}}
        onInvalid={(event) => {
          event.preventDefault();
          setInvalid(true);
          native.current?.parentElement
            ?.querySelector<HTMLButtonElement>("button")
            ?.focus();
        }}
      >
        {[
          ...new Set([...options.map((option) => option.value), ...selected]),
        ].map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <Popover
        label={
          selected.length
            ? selectedLabels.join("、")
            : (placeholder ?? locale.choose)
        }
        aria-label={label}
        align="start"
        width={320}
        trigger={{
          disabled,
          "aria-label": label,
          "aria-invalid": invalid || undefined,
        }}
      >
        <div className="lg-check-list">
          <Input
            type="search"
            autoFocus
            aria-label={locale.search}
            placeholder={locale.search}
            value={search}
            onValueChange={(next) => {
              setSearch(next);
              onSearchChange?.(next);
            }}
          />
          {loading && <Spinner aria-label={locale.loading} />}
          {!loading && !filtered.length && (
            <p className="lg-muted">{locale.empty}</p>
          )}
          {groups.map((group) => (
            <div
              role="group"
              aria-label={group || label}
              key={group}
              className="lg-check-list"
            >
              {group && <div className="lg-field-label">{group}</div>}
              {filtered
                .filter((option) => (option.group ?? "") === group)
                .map((option) => (
                  <Checkbox
                    key={option.value}
                    checked={selected.includes(option.value)}
                    disabled={
                      option.disabled ||
                      (!selected.includes(option.value) &&
                        maxSelected !== undefined &&
                        selected.length >= maxSelected)
                    }
                    description={option.description}
                    onCheckedChange={(checked) => {
                      setInvalid(false);
                      setSelected(
                        checked
                          ? [...selected, option.value]
                          : selected.filter((key) => key !== option.value),
                      );
                    }}
                  >
                    <span className="lg-member-option">
                      {option.icon}
                      {option.label}
                    </span>
                  </Checkbox>
                ))}
            </div>
          ))}
        </div>
      </Popover>
      {invalid && (
        <p role="alert" className="lg-field-error">
          {locale.chooseAtLeastOne}
        </p>
      )}
    </div>
  );
}
