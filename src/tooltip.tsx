import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  type JSX,
  type ReactElement,
  type ReactNode,
} from "react";
import { useControllable } from "./internal/controllable";
import { Floating, type FloatingSide } from "./internal/floating";

export interface TooltipProps {
  /** 单个可聚焦元素（例如 Button）；它需要将 aria-describedby 传到 DOM。 */
  children: ReactElement<{ "aria-describedby"?: string }>;
  content: ReactNode;
  side?: FloatingSide;
  delay?: number;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Tooltip({
  children,
  content,
  side = "top",
  delay = 350,
  disabled = false,
  open: controlled,
  defaultOpen = false,
  onOpenChange,
}: TooltipProps): JSX.Element {
  const anchor = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const focused = useRef(false);
  const hovered = useRef(false);
  const id = useId();
  const [open, setOpen] = useControllable(
    controlled,
    defaultOpen,
    onOpenChange,
  );
  const clear = () => clearTimeout(timer.current);
  const close = () => {
    clear();
    setOpen(false);
  };
  const leave = () => {
    hovered.current = false;
    clear();
    // 留出跨越 trigger 与 tooltip 间距的时间，文字提示可以被鼠标悬停阅读。
    timer.current = setTimeout(() => {
      if (!focused.current && !hovered.current) setOpen(false);
    }, 100);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (disabled) clearTimeout(timer.current);
  }, [disabled]);
  return (
    <span
      ref={anchor}
      className="lg-floating-anchor"
      onPointerEnter={(event) => {
        if (disabled || event.pointerType === "touch") return;
        hovered.current = true;
        clear();
        timer.current = setTimeout(() => setOpen(true), delay);
      }}
      onPointerLeave={leave}
      onFocus={() => {
        focused.current = true;
        if (!disabled) {
          clear();
          setOpen(true);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          focused.current = false;
          close();
        }
      }}
    >
      {cloneElement(children, {
        "aria-describedby":
          [children.props["aria-describedby"], !disabled && open ? id : null]
            .filter(Boolean)
            .join(" ") || undefined,
      })}
      {!disabled && open && (
        <Floating
          id={id}
          anchor={anchor}
          side={side}
          role="tooltip"
          className="lg-tooltip"
          onDismiss={close}
          onPointerEnter={() => {
            hovered.current = true;
            clear();
          }}
          onPointerLeave={leave}
        >
          {content}
        </Floating>
      )}
    </span>
  );
}
