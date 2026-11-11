/** 页面内容分组，使用 tablist/tab/tabpanel 语义并支持禁用项与方向键。 */
import {
  useId,
  useRef,
  type JSX,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useControllable } from "./internal/controllable";
import { useConfig } from "./config-provider";
import { cx } from "./internal/cx";
import { useRefraction } from "./internal/refraction";

export interface TabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}
export interface TabsProps {
  items: readonly TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  "aria-label": string;
  /** 默认保留面板，以免切换标签清空表单或编辑器状态。 */
  keepMounted?: boolean;
  className?: string;
}
export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  "aria-label": name,
  keepMounted = true,
  className,
}: TabsProps): JSX.Element {
  const id = useId();
  const list = useRef<HTMLDivElement>(null);
  useRefraction(list);
  const { direction } = useConfig();
  const [selected, select] = useControllable(
    value,
    defaultValue ?? items.find((item) => !item.disabled)?.value ?? "",
    onValueChange,
  );
  const active =
    items.find((item) => item.value === selected && !item.disabled) ??
    items.find((item) => !item.disabled);
  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    const enabled = items.filter((item) => !item.disabled);
    const index = enabled.findIndex((item) => item.value === active?.value);
    const forward = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
    const backward = direction === "rtl" ? "ArrowRight" : "ArrowLeft";
    let next: TabItem | undefined;
    if (event.key === forward) next = enabled[(index + 1) % enabled.length];
    if (event.key === backward)
      next = enabled[(index - 1 + enabled.length) % enabled.length];
    if (event.key === "Home") next = enabled[0];
    if (event.key === "End") next = enabled.at(-1);
    if (!next) return;
    event.preventDefault();
    select(next.value);
    const target = items.findIndex((item) => item.value === next.value);
    list.current
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [target]?.focus();
  }
  return (
    <div className={cx("lg-tabs", className)}>
      <div
        ref={list}
        className="lg-glass lg-tabs-list"
        role="tablist"
        aria-label={name}
        onKeyDown={navigate}
      >
        {items.map((item, index) => (
          <button
            type="button"
            key={item.value}
            id={`${id}-tab-${index}`}
            role="tab"
            disabled={item.disabled}
            tabIndex={active?.value === item.value ? 0 : -1}
            aria-selected={active?.value === item.value}
            aria-controls={`${id}-panel-${index}`}
            onClick={() => select(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map(
        (item, index) =>
          (keepMounted || active?.value === item.value) && (
            <div
              key={item.value}
              id={`${id}-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${index}`}
              hidden={active?.value !== item.value}
              tabIndex={0}
              className="lg-tabs-panel"
            >
              {item.content}
            </div>
          ),
      )}
    </div>
  );
}
