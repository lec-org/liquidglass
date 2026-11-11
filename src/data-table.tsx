/** 管理列表组合，支持可控排序、跨页选择、列显隐和服务端分页，不负责请求数据。 */
import { useMemo, useState, type JSX, type ReactNode } from "react";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { useConfig } from "./config-provider";
import { useControllable } from "./internal/controllable";
import { Message } from "./message";
import { Pagination, type PaginationProps } from "./pagination";
import { Popover } from "./popover";
import { Spinner } from "./progress";
import { Table, type TableColumn, type TableProps } from "./table";

export interface DataTableColumn<T> extends TableColumn<T> {
  /** 提供比较器可在本页排序，manualSorting 时只发送排序事件。 */
  compare?: (left: T, right: T) => number;
  sortable?: boolean;
}
export interface TableSort {
  key: string;
  direction: "asc" | "desc";
}
export interface RowSelection {
  keys: readonly string[];
  onChange: (keys: string[]) => void;
}
export interface DataTableProps<T> extends Omit<TableProps<T>, "columns"> {
  columns: readonly DataTableColumn<T>[];
  sort?: TableSort | null;
  defaultSort?: TableSort | null;
  onSortChange?: (sort: TableSort | null) => void;
  manualSorting?: boolean;
  selection?: RowSelection;
  pagination?: PaginationProps;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  toolbar?: ReactNode;
  bulkActions?: (keys: readonly string[]) => ReactNode;
}
export function DataTable<T>({
  columns,
  data,
  rowKey,
  sort,
  defaultSort = null,
  onSortChange,
  manualSorting = false,
  selection,
  pagination,
  loading,
  error,
  onRetry,
  toolbar,
  bulkActions,
  ...tableProps
}: DataTableProps<T>): JSX.Element {
  const { locale } = useConfig();
  const [currentSort, setSort] = useControllable(
    sort,
    defaultSort,
    onSortChange,
  );
  const [hidden, setHidden] = useState<string[]>([]);
  const visible = columns.filter((column) => !hidden.includes(column.key));
  const rows = useMemo(() => {
    const column = columns.find((item) => item.key === currentSort?.key);
    if (manualSorting || !column?.compare || !currentSort) return data;
    return [...data].sort(
      (left, right) =>
        column.compare!(left, right) *
        (currentSort.direction === "asc" ? 1 : -1),
    );
  }, [columns, currentSort, data, manualSorting]);
  const displayColumns: TableColumn<T>[] = visible.map((column) => {
    if (!column.sortable && !column.compare) return column;
    const direction =
      currentSort?.key === column.key ? currentSort.direction : null;
    return {
      ...column,
      ariaSort:
        direction === "asc"
          ? "ascending"
          : direction === "desc"
            ? "descending"
            : "none",
      title: (
        <button
          type="button"
          className="lg-table-sort"
          disabled={loading}
          onClick={() => {
            setSort(
              direction === "desc"
                ? null
                : {
                    key: column.key,
                    direction: direction === "asc" ? "desc" : "asc",
                  },
            );
          }}
        >
          {column.title}
          <span aria-hidden="true">
            {direction === "asc" ? " ↑" : direction === "desc" ? " ↓" : " ↕"}
          </span>
        </button>
      ),
    };
  });
  if (selection) {
    const selected = new Set(selection.keys);
    const visibleKeys = data.map(rowKey);
    const count = visibleKeys.filter((key) => selected.has(key)).length;
    displayColumns.unshift({
      key: "__selection",
      width: 58,
      title: (
        <Checkbox
          aria-label={locale.selectAll}
          checked={visibleKeys.length > 0 && count === visibleKeys.length}
          disabled={loading || !visibleKeys.length}
          indeterminate={count > 0 && count < visibleKeys.length}
          onCheckedChange={(checked) => {
            for (const key of visibleKeys) {
              if (checked) selected.add(key);
              else selected.delete(key);
            }
            selection.onChange([...selected]);
          }}
        />
      ),
      render: (row) => (
        <Checkbox
          aria-label={locale.selectRow(rowKey(row))}
          checked={selected.has(rowKey(row))}
          disabled={loading}
          onCheckedChange={(checked) => {
            if (checked) selected.add(rowKey(row));
            else selected.delete(rowKey(row));
            selection.onChange([...selected]);
          }}
        />
      ),
    });
  }
  return (
    <div className="lg-data-table" aria-busy={loading || undefined}>
      <div className="lg-data-toolbar">
        <div>
          {selection?.keys.length && bulkActions
            ? bulkActions(selection.keys)
            : toolbar}
        </div>
        <Popover
          label={locale.columns}
          aria-label={locale.columns}
          align="end"
          width={220}
        >
          <div className="lg-check-list">
            {columns.map((column) => (
              <Checkbox
                key={column.key}
                checked={!hidden.includes(column.key)}
                disabled={visible.length === 1 && !hidden.includes(column.key)}
                onCheckedChange={(checked) => {
                  setHidden(
                    checked
                      ? hidden.filter((key) => key !== column.key)
                      : [...hidden, column.key],
                  );
                }}
              >
                {column.title}
              </Checkbox>
            ))}
          </div>
        </Popover>
      </div>
      {error ? (
        <Message
          tone="error"
          action={
            onRetry ? { label: locale.retry, onClick: onRetry } : undefined
          }
        >
          {error}
        </Message>
      ) : (
        <Table
          {...tableProps}
          rowKey={rowKey}
          columns={displayColumns}
          data={rows}
          empty={
            loading ? <Spinner aria-label={locale.loading} /> : tableProps.empty
          }
        />
      )}
      {loading && rows.length > 0 && (
        <span role="status" className="lg-muted">
          {locale.loading}
        </span>
      )}
      {pagination && (
        <Pagination {...pagination} disabled={loading || pagination.disabled} />
      )}
    </div>
  );
}
