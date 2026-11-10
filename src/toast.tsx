import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type JSX,
  type ReactNode,
} from "react";
import { Button } from "./button";
import { Glass } from "./glass";
import { cx } from "./internal/cx";

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: "info" | "success" | "warning" | "error";
  /** 毫秒，0 表示不自动关闭；鼠标悬停、内部焦点或页面隐藏时暂停计时。 */
  duration?: number;
  action?: { label: string; onClick: () => void };
  onDismiss?: () => void;
}
export interface ToastProps extends ToastOptions {
  className?: string;
  closeLabel?: string;
}

/** 独立提示视图。全局提示推荐通过 ToastProvider / useToast 管理生命周期。 */
export function Toast({
  title,
  description,
  tone = "info",
  duration = 0,
  action,
  onDismiss,
  closeLabel = "关闭提示",
  className,
}: ToastProps): JSX.Element {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const remaining = useRef(duration);
  const dismiss = useRef(onDismiss);
  useEffect(() => {
    dismiss.current = onDismiss;
  });
  useEffect(() => {
    const change = () => setHidden(document.hidden);
    change();
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  useEffect(() => {
    remaining.current = duration;
  }, [duration]);
  useEffect(() => {
    if (duration <= 0 || hovered || focused || hidden) return;
    const start = Date.now();
    const timer = setTimeout(
      () => dismiss.current?.(),
      Math.max(0, remaining.current),
    );
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - start));
    };
  }, [duration, hovered, focused, hidden]);
  return (
    <Glass
      className={cx("lg-toast", className)}
      data-tone={tone}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && onDismiss) {
          event.preventDefault();
          event.stopPropagation();
          onDismiss();
        }
      }}
    >
      <span className="lg-toast-icon" aria-hidden="true">
        {tone === "success"
          ? "✓"
          : tone === "error"
            ? "×"
            : tone === "warning"
              ? "!"
              : "i"}
      </span>
      <div className="lg-toast-content">
        <div role={tone === "error" ? "alert" : "status"} aria-atomic="true">
          <div className="lg-toast-title">{title}</div>
          {description && (
            <div className="lg-toast-description">{description}</div>
          )}
        </div>
        {action && (
          <Button
            size="small"
            onClick={() => {
              action.onClick();
              onDismiss?.();
            }}
          >
            {action.label}
          </Button>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="lg-dismiss"
          aria-label={closeLabel}
          onClick={onDismiss}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </Glass>
  );
}

export interface ToastApi {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}
export interface ToastProviderProps {
  children: ReactNode;
  duration?: number;
  /** 超出数量的提示按顺序等待，显示时才开始计时。 */
  maxVisible?: number;
  position?: "top-right" | "bottom-right" | "bottom-center";
  label?: string;
  closeLabel?: string;
}
interface ToastRecord {
  id: string;
  options: ToastOptions;
  returnFocus: HTMLElement | null;
}
const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({
  children,
  duration = 4500,
  maxVisible = 3,
  position = "bottom-right",
  label = "通知",
  closeLabel,
}: ToastProviderProps): JSX.Element {
  const prefix = useId();
  const sequence = useRef(0);
  const [items, setItems] = useState<ToastRecord[]>([]);
  const records = useRef<ToastRecord[]>([]);
  const viewport = useRef<HTMLDivElement>(null);
  const limit = Number.isFinite(maxVisible)
    ? Math.max(1, Math.floor(maxVisible))
    : 3;
  const toast = useCallback(
    (options: ToastOptions) => {
      const item = {
        id: `${prefix}-${++sequence.current}`,
        options,
        returnFocus:
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null,
      };
      records.current = [...records.current, item];
      setItems(records.current);
      return item.id;
    },
    [prefix],
  );
  const dismiss = useCallback((id: string) => {
    const item = records.current.find((record) => record.id === id);
    if (!item) return;
    // 只在被删除的提示持有焦点时归还焦点；自动消失不打断正在进行的输入。
    if (
      document.getElementById(id)?.contains(document.activeElement) &&
      item.returnFocus?.isConnected
    )
      item.returnFocus.focus({ preventScroll: true });
    records.current = records.current.filter((record) => record.id !== id);
    setItems(records.current);
    item.options.onDismiss?.();
  }, []);
  const dismissAll = useCallback(() => {
    for (const item of [...records.current]) dismiss(item.id);
  }, [dismiss]);
  const api = useMemo(
    () => ({ toast, dismiss, dismissAll }),
    [toast, dismiss, dismissAll],
  );
  const hasItems = items.length > 0;
  useEffect(() => {
    const panel = viewport.current;
    if (!panel || typeof panel.showPopover !== "function") return;
    panel.setAttribute("popover", "manual");
    try {
      if (hasItems && !panel.matches(":popover-open")) panel.showPopover();
      if (!hasItems && panel.matches(":popover-open")) panel.hidePopover();
    } catch {
      panel.removeAttribute("popover");
    }
  }, [hasItems]);
  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        ref={viewport}
        className="lg-toast-viewport"
        data-position={position}
        role="region"
        aria-label={label}
        tabIndex={-1}
      >
        {items.slice(0, limit).map((item) => (
          <div key={item.id} id={item.id}>
            <Toast
              {...item.options}
              duration={item.options.duration ?? duration}
              closeLabel={closeLabel}
              onDismiss={() => dismiss(item.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast 必须在 ToastProvider 内使用。");
  return context;
}
