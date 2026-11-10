import type { JSX, ReactNode } from "react";
import { Button } from "./button";
import { Glass } from "./glass";
import { cx } from "./internal/cx";

export interface MessageProps {
  children: ReactNode;
  tone?: "info" | "error";
  action?: { label: string; onClick: () => void };
  className?: string;
}

/** 在当前界面反馈操作结果，关闭或重试由调用方控制。 */
export function Message({ children, tone = "info", action, className }: MessageProps): JSX.Element {
  return (
    <Glass className={cx("lg-message", className)} data-tone={tone}>
      <div className="lg-message-body" role={tone === "error" ? "alert" : "status"}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d={tone === "error" ? "M12 8v4m0 4h.01" : "M12 8h.01M12 12v4"} />
        </svg>
        <span>{children}</span>
      </div>
      {action && <Button size="small" onClick={action.onClick}>{action.label}</Button>}
    </Glass>
  );
}
