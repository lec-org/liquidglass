/** 通用模态内容容器，用于详情、表单与确认流程；原生 dialog 管理焦点与嵌套层级。 */
import {
  useEffect,
  useId,
  useRef,
  type JSX,
  type ReactNode,
  type RefObject,
} from "react";
import { Button } from "./button";
import { useConfig } from "./config-provider";
import { useModal, reducedMotion } from "./internal/modal";
import { cx } from "./internal/cx";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "small" | "regular" | "large";
  /** 异步提交期间可禁用关闭，退出动画仍由受控 open 驱动。 */
  dismissible?: boolean;
  /** 内容进入模态层后聚焦的控件，省略时聚焦容器。 */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** 关闭后返回的触发控件，受控弹窗应提供，以兼容 Safari 的鼠标焦点行为。 */
  returnFocusRef?: RefObject<HTMLElement | null>;
  className?: string;
}
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "regular",
  dismissible = true,
  initialFocusRef,
  returnFocusRef,
  className,
}: DialogProps): JSX.Element {
  const ref = useRef<HTMLDialogElement>(null);
  const backdropPress = useRef(false);
  const id = useId();
  const { locale } = useConfig();
  const requestClose = () => {
    if (dismissible) onOpenChange(false);
  };
  const { phase, finished } = useModal(ref, open, requestClose, returnFocusRef);
  useEffect(() => {
    if (phase === "open")
      initialFocusRef?.current?.focus({ preventScroll: true });
  }, [phase, initialFocusRef]);
  const finish = useRef(finished);
  useEffect(() => {
    finish.current = finished;
  });
  useEffect(() => {
    if (phase !== "leaving") return;
    const timer = setTimeout(() => finish.current(), reducedMotion() ? 0 : 150);
    return () => clearTimeout(timer);
  }, [phase]);
  return (
    <dialog
      ref={ref}
      className={cx("lg-dialog", className)}
      data-phase={phase}
      data-size={size}
      aria-labelledby={id + "-title"}
      aria-describedby={description ? id + "-description" : undefined}
      onPointerDown={(event) => {
        backdropPress.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && backdropPress.current)
          requestClose();
      }}
    >
      {phase !== "closed" && (
        <div className="lg-dialog-panel">
          <header className="lg-dialog-header">
            <div>
              <h2 id={id + "-title"}>{title}</h2>
              {description && <p id={id + "-description"}>{description}</p>}
            </div>
            {dismissible && (
              <Button
                aria-label={locale.close}
                size="small"
                onClick={requestClose}
              >
                ×
              </Button>
            )}
          </header>
          <div className="lg-dialog-content">{children}</div>
          {footer && <footer className="lg-dialog-footer">{footer}</footer>}
        </div>
      )}
    </dialog>
  );
}
