/** 数据列表分页，页码与总数由上层维护，可直接驱动服务端分页。 */
import { useConfig } from "./config-provider";
import { Button } from "./button";
import { Select } from "./select";
import { Chevron } from "./internal/chevron";
import type { JSX } from "react";

export interface PaginationProps {
  total: number;
  page: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  pageSizeOptions?: readonly number[];
  onPageSizeChange?: (size: number) => void;
  disabled?: boolean;
  "aria-label"?: string;
}
export function Pagination({
  total,
  page,
  pageSize = 10,
  onPageChange,
  pageSizeOptions = [10, 20, 50],
  onPageSizeChange,
  disabled,
  "aria-label": label,
}: PaginationProps): JSX.Element {
  const { locale } = useConfig();
  const size =
    Number.isFinite(pageSize) && pageSize > 0
      ? Math.max(1, Math.floor(pageSize))
      : 10;
  const safeTotal = Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0;
  const count = Math.max(1, Math.ceil(safeTotal / size));
  const current = Math.max(
    1,
    Math.min(count, Number.isFinite(page) ? Math.floor(page) : 1),
  );
  const candidates = [1, current - 1, current, current + 1, count];
  const pages = [
    ...new Set(candidates.filter((number) => number >= 1 && number <= count)),
  ].sort((a, b) => a - b);
  const sizeOptions = [
    ...new Set([
      size,
      ...pageSizeOptions.filter(
        (option) => Number.isInteger(option) && option > 0,
      ),
    ]),
  ]
    .sort((a, b) => a - b)
    .map((option) => ({
      value: String(option),
      label: locale.pageSizeOption(option),
    }));
  return (
    <nav className="lg-pagination" aria-label={label ?? locale.pagination}>
      <span className="lg-muted">{locale.total(safeTotal)}</span>
      <Button
        icon={<Chevron direction="previous" />}
        size="small"
        aria-label={locale.previous}
        disabled={disabled || current === 1}
        onClick={() => onPageChange(current - 1)}
      />
      {pages.map((number, index) => (
        <span className="lg-pagination-page" key={number}>
          {index > 0 && number - pages[index - 1]! > 1 && (
            <span aria-hidden="true">…</span>
          )}
          <Button
            size="small"
            aria-label={locale.page(number)}
            aria-current={number === current ? "page" : undefined}
            variant={number === current ? "filled" : "glass"}
            disabled={disabled}
            onClick={() => onPageChange(number)}
          >
            {number}
          </Button>
        </span>
      ))}
      <Button
        icon={<Chevron direction="next" />}
        size="small"
        aria-label={locale.next}
        disabled={disabled || current === count}
        onClick={() => onPageChange(current + 1)}
      />
      {onPageSizeChange && (
        <Select
          className="lg-pagination-size"
          aria-label={locale.pageSize}
          value={String(size)}
          disabled={disabled}
          options={sizeOptions}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        />
      )}
    </nav>
  );
}
