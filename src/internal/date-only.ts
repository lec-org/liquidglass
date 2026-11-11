/** 将业务日期转为本地中午的 Date，避免 UTC 转换把日期挪到前一天。 */
export function parseDateOnly(value?: string): Date | undefined {
  if (!value || !/^[1-9]\d{3}-(0[1-9]|1[0-2])-\d{2}$/.test(value)) return;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year!, month! - 1, day, 12);
  if (
    date.getFullYear() === year &&
    date.getMonth() === month! - 1 &&
    date.getDate() === day
  )
    return date;
}
/** 按本地年月日编码；不使用 toISOString，以保留日期字符串的原意。 */
export function formatDateOnly(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
