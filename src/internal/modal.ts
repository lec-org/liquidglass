import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

const useLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

export type ModalPhase = "closed" | "open" | "leaving";

/**
 * Keeps a <dialog> in the top layer from when `open` turns true until `finished`
 * is called after it turns false, so it has time to animate out.
 */
export function useModal(
  ref: RefObject<HTMLDialogElement | null>,
  open: boolean,
  requestClose: () => void,
  returnFocusRef?: RefObject<HTMLElement | null>,
): { phase: ModalPhase; finished: () => void } {
  const [phase, setPhase] = useState<ModalPhase>(open ? "open" : "closed");
  const close = useRef(requestClose);
  const previousFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    close.current = requestClose;
  });

  useLayout(() => {
    setPhase((now) =>
      open ? "open" : now === "closed" ? "closed" : "leaving",
    );
  }, [open]);

  useLayout(() => {
    const dialog = ref.current;
    if (!dialog || phase !== "open" || dialog.open) return;
    previousFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    // The browser would focus the first button and may ring it, which iOS never
    // does. The dialog takes focus instead, and Tab goes on to the first button.
    dialog.tabIndex = -1;
    dialog.focus({ preventScroll: true });
  }, [phase, ref]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // Escape asks to close, so a controlled owner can refuse and the exit still animates.
    const cancel = (event: Event) => {
      event.preventDefault();
      close.current();
    };
    dialog.addEventListener("cancel", cancel);
    return () => dialog.removeEventListener("cancel", cancel);
  }, [ref, phase]);

  const finished = () => {
    const dialog = ref.current;
    // Safari 鼠标点击按钮不一定改变 activeElement，显式引用可保留真实的触发入口。
    const target = returnFocusRef?.current ?? previousFocus.current;
    const shouldRestore =
      dialog?.contains(document.activeElement) ||
      document.activeElement === document.body;
    if (typeof dialog?.close === "function" && dialog.open) dialog.close();
    else dialog?.removeAttribute("open");
    if (
      shouldRestore &&
      target?.isConnected &&
      !target.matches(':disabled, [aria-disabled="true"]')
    ) {
      target.focus({ preventScroll: true });
    }
    setPhase("closed");
  };

  return { phase, finished };
}

export const reducedMotion = (): boolean =>
  typeof matchMedia === "function" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;
