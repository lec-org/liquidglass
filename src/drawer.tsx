/** 桌面侧边面板，共用 Dialog 的焦点、关闭与异步操作约束。 */
import type { JSX } from "react";
import { Dialog, type DialogProps } from "./dialog";
import { cx } from "./internal/cx";

export interface DrawerProps extends DialogProps {
  side?: "start" | "end";
}
export function Drawer({
  side = "end",
  className,
  ...props
}: DrawerProps): JSX.Element {
  return (
    <Dialog
      {...props}
      className={cx("lg-drawer lg-drawer-" + side, className)}
    />
  );
}
