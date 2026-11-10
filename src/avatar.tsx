import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type JSX,
  type ReactNode,
} from "react";
import { cx } from "./internal/cx";
import { useRefraction } from "./internal/refraction";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  /** 图片加载失败或未提供时，优先显示 children，再显示姓名首字。 */
  name?: string;
  children?: ReactNode;
  size?: "small" | "regular" | "large" | number;
  shape?: "circle" | "rounded";
  onImageError?: () => void;
}

export function Avatar({
  src,
  alt,
  name,
  children,
  size = "regular",
  shape = "circle",
  onImageError,
  className,
  style,
  ...props
}: AvatarProps): JSX.Element {
  const [failed, setFailed] = useState<string>();
  useEffect(() => {
    setFailed(undefined);
  }, [src]);
  const ref = useRef<HTMLSpanElement>(null);
  useRefraction(ref);
  const label = props["aria-label"] ?? alt ?? name ?? "头像";
  const pixels =
    typeof size === "number"
      ? Math.max(16, size)
      : { small: 28, regular: 40, large: 64 }[size];
  return (
    <span
      {...props}
      ref={ref}
      role="img"
      aria-label={label}
      className={cx("lg-glass lg-avatar", className)}
      data-shape={shape}
      style={{ ...style, "--lg-avatar-size": `${pixels}px` } as CSSProperties}
    >
      {src && failed !== src ? (
        <img
          key={src}
          src={src}
          alt=""
          onError={() => {
            setFailed(src);
            onImageError?.();
          }}
        />
      ) : (
        <span aria-hidden="true">
          {children ??
            (Array.from(name?.trim() || "")[0]?.toLocaleUpperCase() || (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
              </svg>
            ))}
        </span>
      )}
    </span>
  );
}
