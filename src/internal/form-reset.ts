import { useEffect, useRef, type RefObject } from "react";

/** React 管理的表单值也需要响应原生 reset；等事件完成后再检查是否被取消。 */
export function useFormReset(
  ref: RefObject<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null
  >,
  reset: () => void,
): void {
  const latest = useRef(reset);
  useEffect(() => {
    latest.current = reset;
  });
  useEffect(() => {
    const handle = (event: Event) => {
      if (event.target !== ref.current?.form) return;
      queueMicrotask(() => {
        if (!event.defaultPrevented && ref.current) latest.current();
      });
    };
    document.addEventListener("reset", handle);
    return () => document.removeEventListener("reset", handle);
  }, [ref]);
}
