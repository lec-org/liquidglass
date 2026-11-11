/** 通用语义表格。列使用稳定 key，数据和排序由调用方控制。 */
import type { CSSProperties, JSX, ReactNode } from "react";
import { cx } from "./internal/cx";
import { useConfig } from "./config-provider";

export interface TableColumn<T> {
  key: string;
  title: ReactNode;
  render: (row: T) => ReactNode;
  align?: "start" | "center" | "end";
  width?: CSSProperties["width"];
  /** 默认单行展示结构化字段；长描述可以按列启用换行。 */
  wrap?: boolean;
  ariaSort?: "none" | "ascending" | "descending";
}
export interface TableProps<T> {
  columns: readonly TableColumn<T>[];
  data: readonly T[];
  rowKey: (row: T) => string;
  caption: string;
  empty?: ReactNode;
  rowClassName?: (row: T) => string | undefined;
  className?: string;
}
export function Table<T>({
  columns,
  data,
  rowKey,
  caption,
  empty,
  rowClassName,
  className,
}: TableProps<T>): JSX.Element {
  const { locale } = useConfig();
  return (
    <div
      className={cx("lg-table-scroll", className)}
      tabIndex={0}
      role="region"
      aria-label={caption}
    >
      <table className="lg-table">
        <caption className="lg-sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                aria-sort={column.ariaSort}
                style={{
                  width: column.width,
                  textAlign: column.align,
                  whiteSpace: column.wrap ? "normal" : "nowrap",
                }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((row) => (
              <tr key={rowKey(row)} className={rowClassName?.(row)}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{
                      textAlign: column.align,
                      whiteSpace: column.wrap ? "normal" : "nowrap",
                    }}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={Math.max(1, columns.length)}
                className="lg-table-empty"
              >
                {empty ?? locale.empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
