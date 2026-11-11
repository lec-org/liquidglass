/** 应用级快捷命令入口。命令、搜索范围和执行行为由接入项目提供。 */
import {
  useEffect,
  useId,
  useRef,
  useState,
  type JSX,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { Dialog } from "./dialog";
import { Input } from "./input";
import { useConfig } from "./config-provider";

export interface PaletteCommand {
  id: string;
  title: string;
  description?: string;
  group?: string;
  keywords?: readonly string[];
  disabled?: boolean;
  onSelect: () => void;
}
export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: readonly PaletteCommand[];
  title?: string;
  /** 应用只为一个命令面板启用全局 Cmd/Ctrl+K。 */
  shortcut?: boolean;
  /** 按钮打开时传入触发按钮；快捷键打开时可传入工作区的返回入口。 */
  returnFocusRef?: RefObject<HTMLElement | null>;
}
export function CommandPalette({
  open,
  onOpenChange,
  commands,
  title = "快捷命令",
  shortcut = false,
  returnFocusRef,
}: CommandPaletteProps): JSX.Element {
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const { locale } = useConfig();
  const query = search.trim().toLocaleLowerCase();
  const results = commands.filter((command) =>
    [
      command.title,
      command.description,
      command.group,
      ...(command.keywords ?? []),
    ]
      .join(" ")
      .toLocaleLowerCase()
      .includes(query),
  );
  const enabled = results.filter((command) => !command.disabled);
  const active =
    enabled.find((command) => command.id === activeId) ?? enabled[0];
  useEffect(() => {
    if (open) {
      setSearch("");
      input.current?.focus();
    }
  }, [open]);
  useEffect(() => {
    if (!shortcut) return;
    const key = (event: globalThis.KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k" &&
        !event.isComposing &&
        !event.repeat
      ) {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [shortcut, open, onOpenChange]);
  function select(command: PaletteCommand) {
    if (command.disabled) return;
    onOpenChange(false);
    command.onSelect();
  }
  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" && active) {
      event.preventDefault();
      select(active);
    }
    const index = enabled.findIndex((command) => command.id === active?.id);
    const by = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    if (!by || !enabled.length) return;
    event.preventDefault();
    const next = enabled[(index + by + enabled.length) % enabled.length]!;
    setActiveId(next.id);
    document
      .getElementById(id + "-" + next.id)
      ?.scrollIntoView({ block: "nearest" });
  }
  return (
    <Dialog
      returnFocusRef={returnFocusRef}
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      initialFocusRef={input}
    >
      <div className="lg-command-palette" onKeyDown={navigate}>
        <Input
          ref={input}
          type="search"
          role="combobox"
          aria-label={locale.search}
          aria-expanded="true"
          aria-controls={id}
          aria-autocomplete="list"
          aria-activedescendant={active ? id + "-" + active.id : undefined}
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setActiveId("");
          }}
          placeholder={locale.search}
        />
        <ul id={id} role="listbox" aria-label={title}>
          {results.map((command) => (
            <li
              role="option"
              id={id + "-" + command.id}
              key={command.id}
              aria-disabled={command.disabled || undefined}
              aria-selected={active?.id === command.id}
            >
              <button
                type="button"
                tabIndex={-1}
                disabled={command.disabled}
                onPointerMove={() => setActiveId(command.id)}
                onClick={() => select(command)}
              >
                <span>
                  {command.title}
                  {command.description && <small>{command.description}</small>}
                </span>
                {command.group && <small>{command.group}</small>}
              </button>
            </li>
          ))}
        </ul>
        {!results.length && <p className="lg-muted">{locale.empty}</p>}
      </div>
    </Dialog>
  );
}
