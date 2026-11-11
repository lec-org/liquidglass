/** 月份与分页导航共用的方向图标，随界面书写方向镜像。 */
import type { JSX } from "react";

export interface ChevronProps {
  direction: "previous" | "next";
}
export function Chevron({ direction }: ChevronProps): JSX.Element {
  return (
    <svg
      className="lg-chevron"
      data-direction={direction}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}
