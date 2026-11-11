import {
  useEffect,
  useLayoutEffect,
  useRef,
  type HTMLAttributes,
  type JSX,
  type RefObject,
} from "react";
import { cx } from "./cx";
import { useRefraction } from "./refraction";

export type FloatingSide = "top" | "bottom" | "left" | "right";
export type DismissReason = "escape" | "outside" | "focus";
interface FloatingProps extends HTMLAttributes<HTMLDivElement> {
  anchor: RefObject<HTMLElement | null>;
  side?: FloatingSide;
  align?: "start" | "center" | "end";
  onDismiss: (reason: DismissReason) => void;
  focusOnOpen?: boolean;
  dismissOnBlur?: boolean;
  /** 大型日历可在空间不足时覆盖触发器，优先使用完整视口高度。 */
  allowAnchorOverlap?: boolean;
}

const useLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;
// 嵌套浮层只让最上层消费 Escape，避免关闭 Popover 时连带关闭它的父层。
const layers: HTMLElement[] = [];
const focusable =
  'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]';

export function Floating({
  anchor,
  side = "bottom",
  align = "center",
  onDismiss,
  focusOnOpen = false,
  dismissOnBlur = true,
  allowAnchorOverlap = false,
  className,
  children,
  ...props
}: FloatingProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const latest = useRef(onDismiss);
  useLayout(() => {
    latest.current = onDismiss;
  });
  useRefraction(ref);

  useLayout(() => {
    const panel = ref.current;
    const trigger = anchor.current;
    if (!panel || !trigger) return;
    // 留在原 DOM 树以继承局部主题，借助原生 top layer 跨过 overflow 和 transform。
    if (typeof panel.showPopover === "function") {
      panel.setAttribute("popover", "manual");
      try {
        panel.showPopover();
      } catch {
        panel.removeAttribute("popover");
      }
    }
    layers.push(panel);
    const place = () => {
      const viewport = window.visualViewport;
      const vx = viewport?.offsetLeft ?? 0;
      const vy = viewport?.offsetTop ?? 0;
      const vw = viewport?.width ?? document.documentElement.clientWidth;
      const vh = viewport?.height ?? window.innerHeight;
      const edge = 8;
      const gap = 8;
      panel.style.maxWidth = `${Math.max(0, vw - edge * 2)}px`;
      panel.style.maxHeight = `${Math.max(0, vh - edge * 2)}px`;
      const box = trigger.getBoundingClientRect();
      const size = panel.getBoundingClientRect();
      const room = {
        top: box.top - vy - edge - gap,
        bottom: vy + vh - box.bottom - edge - gap,
        left: box.left - vx - edge - gap,
        right: vx + vw - box.right - edge - gap,
      };
      const opposite = {
        top: "bottom",
        bottom: "top",
        left: "right",
        right: "left",
      } as const;
      const horizontal = side === "left" || side === "right";
      const needed = horizontal ? size.width : size.height;
      const actual =
        room[side] < needed && room[opposite[side]] > room[side]
          ? opposite[side]
          : side;
      if (!horizontal && !allowAnchorOverlap)
        panel.style.maxHeight = `${Math.max(0, room[actual])}px`;
      const width = panel.offsetWidth;
      const height = panel.offsetHeight;
      let left =
        align === "start"
          ? box.left
          : align === "end"
            ? box.right - width
            : box.left + (box.width - width) / 2;
      let top =
        align === "start"
          ? box.top
          : align === "end"
            ? box.bottom - height
            : box.top + (box.height - height) / 2;
      if (actual === "top") top = box.top - height - gap;
      if (actual === "bottom") top = box.bottom + gap;
      if (actual === "left") left = box.left - width - gap;
      if (actual === "right") left = box.right + gap;
      panel.style.left = `${Math.max(vx + edge, Math.min(left, vx + vw - edge - width))}px`;
      panel.style.top = `${Math.max(vy + edge, Math.min(top, vy + vh - edge - height))}px`;
      panel.dataset.side = actual;
    };
    place();
    if (focusOnOpen)
      (panel.querySelector<HTMLElement>(focusable) ?? panel).focus({
        preventScroll: true,
      });
    const observer = new ResizeObserver(place);
    observer.observe(panel);
    observer.observe(trigger);
    const outside = (event: Event) => {
      if (layers.at(-1) !== panel) return;
      const target = event.target as Node;
      if (!panel.contains(target) && !trigger.contains(target))
        latest.current(event.type === "focusin" ? "focus" : "outside");
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || layers.at(-1) !== panel) return;
      event.preventDefault();
      event.stopPropagation();
      latest.current("escape");
    };
    document.addEventListener("pointerdown", outside, true);
    if (dismissOnBlur) document.addEventListener("focusin", outside);
    document.addEventListener("keydown", escape, true);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    window.visualViewport?.addEventListener("resize", place);
    window.visualViewport?.addEventListener("scroll", place);
    return () => {
      const index = layers.indexOf(panel);
      if (index !== -1) layers.splice(index, 1);
      observer.disconnect();
      document.removeEventListener("pointerdown", outside, true);
      document.removeEventListener("focusin", outside);
      document.removeEventListener("keydown", escape, true);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      window.visualViewport?.removeEventListener("resize", place);
      window.visualViewport?.removeEventListener("scroll", place);
      if (panel.hasAttribute("popover") && panel.matches(":popover-open"))
        panel.hidePopover();
    };
  }, [anchor, side, align, focusOnOpen, dismissOnBlur, allowAnchorOverlap]);

  return (
    <div
      {...props}
      ref={ref}
      tabIndex={-1}
      className={cx("lg-glass lg-floating", className)}
    >
      {children}
    </div>
  );
}
