import {
  useId,
  useRef,
  type CSSProperties,
  type JSX,
  type ReactNode,
} from "react";
import { Button, type ButtonProps } from "./button";
import { useControllable } from "./internal/controllable";
import { Floating, type FloatingSide } from "./internal/floating";

export interface PopoverProps {
  label: ReactNode;
  "aria-label": string;
  title?: ReactNode;
  children: ReactNode | ((controls: { close: () => void }) => ReactNode);
  trigger?: Omit<ButtonProps, "children" | "onClick">;
  side?: FloatingSide;
  align?: "start" | "center" | "end";
  width?: CSSProperties["width"];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function Popover({
  label,
  "aria-label": name,
  title,
  children,
  trigger,
  side = "bottom",
  align = "center",
  width = 300,
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  className,
}: PopoverProps): JSX.Element {
  const anchor = useRef<HTMLButtonElement>(null);
  const id = useId();
  const [open, setOpen] = useControllable(
    controlled,
    defaultOpen,
    onOpenChange,
  );
  const close = () => {
    setOpen(false);
    anchor.current?.focus({ preventScroll: true });
  };
  return (
    <span className="lg-floating-anchor">
      <Button
        {...trigger}
        ref={anchor}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen(!open)}
      >
        {label}
      </Button>
      {open && (
        <Floating
          id={id}
          anchor={anchor}
          side={side}
          align={align}
          role="dialog"
          aria-label={name}
          className={`lg-popover ${className ?? ""}`}
          style={{ width }}
          focusOnOpen
          onDismiss={(reason) => {
            if (reason === "escape") close();
            else setOpen(false);
          }}
        >
          {title != null && <div className="lg-popover-title">{title}</div>}
          {typeof children === "function" ? children({ close }) : children}
        </Floating>
      )}
    </span>
  );
}
