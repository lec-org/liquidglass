/** 跨页面的主题、语言与布局配置。嵌套配置继承未指定的选项。 */
import {
  createContext,
  useContext,
  useMemo,
  type CSSProperties,
  type HTMLAttributes,
  type JSX,
  type ReactNode,
} from "react";

export interface Locale {
  languageTag: string;
  cancel: string;
  applyRange: string;
  invalidDateRange: string;
  requiredDateRange: string;
  close: string;
  choose: string;
  pagination: string;
  dateRange: string;
  resetFilters: string;
  increase: string;
  decrease: string;
  showTabs: string;
  previousMonth: string;
  nextMonth: string;
  calendarMonth: (month: string) => string;
  activeDays: (count: number) => string;
  lessActivity: string;
  moreActivity: string;
  weekdays: readonly string[];
  selectRow: (key: string) => string;
  chooseAtLeastOne: string;
  dropFiles: string;
  tooManyFiles: (maximum: number) => string;
  invalidFile: (name: string) => string;
  clear: string;
  previous: string;
  next: string;
  loading: string;
  empty: string;
  retry: string;
  selectAll: string;
  columns: string;
  search: string;
  startDate: string;
  endDate: string;
  page: (page: number) => string;
  pageSize: string;
  pageSizeOption: (size: number) => string;
  total: (total: number) => string;
}
export const zhCN: Locale = {
  languageTag: "zh-CN",
  cancel: "取消",
  applyRange: "应用范围",
  invalidDateRange: "请选择有效的起止日期，并保持结束日期不早于开始日期。",
  requiredDateRange: "请选择开始日期和结束日期。",
  choose: "请选择",
  pagination: "分页",
  dateRange: "日期范围",
  resetFilters: "重置筛选",
  increase: "增加",
  decrease: "减少",
  showTabs: "展开标签",
  previousMonth: "上个月",
  nextMonth: "下个月",
  calendarMonth: (month) =>
    `${month.slice(0, 4)} 年 ${Number(month.slice(5))} 月`,
  activeDays: (count) => `活跃 ${count} 天`,
  lessActivity: "少",
  moreActivity: "多",
  weekdays: ["一", "二", "三", "四", "五", "六", "日"],
  selectRow: (key) => "选择 " + key,
  chooseAtLeastOne: "请至少选择一项",
  dropFiles: "也可将文件拖放到这里",
  tooManyFiles: (maximum) => `最多选择 ${maximum} 个文件`,
  invalidFile: (name) => `${name} 的类型或大小不符合要求`,
  close: "关闭",
  clear: "清除",
  previous: "上一页",
  next: "下一页",
  loading: "加载中",
  empty: "暂无数据",
  retry: "重试",
  selectAll: "全选",
  columns: "显示列",
  search: "搜索",
  startDate: "开始日期",
  endDate: "结束日期",
  page: (page) => `第 ${page} 页`,
  pageSize: "每页条数",
  pageSizeOption: (size) => `${size} / 页`,
  total: (total) => `共 ${total} 条`,
};
export const enUS: Locale = {
  languageTag: "en-US",
  cancel: "Cancel",
  applyRange: "Apply range",
  invalidDateRange: "Choose valid dates with the end on or after the start.",
  requiredDateRange: "Choose a start and an end date.",
  choose: "Choose an option",
  pagination: "Pagination",
  dateRange: "Date range",
  resetFilters: "Reset filters",
  increase: "Increase",
  decrease: "Decrease",
  showTabs: "Expand tabs",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  calendarMonth: (month) =>
    new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(month + "-01T12:00:00Z")),
  activeDays: (count) => `${count} active days`,
  lessActivity: "Less",
  moreActivity: "More",
  weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  selectRow: (key) => "Select " + key,
  chooseAtLeastOne: "Select at least one option",
  dropFiles: "Or drop files here",
  tooManyFiles: (maximum) => `Choose at most ${maximum} files`,
  invalidFile: (name) => `${name} has an unsupported type or size`,
  close: "Close",
  clear: "Clear",
  previous: "Previous",
  next: "Next",
  loading: "Loading",
  empty: "No data",
  retry: "Retry",
  selectAll: "Select all",
  columns: "Columns",
  search: "Search",
  startDate: "Start date",
  endDate: "End date",
  page: (page) => `Page ${page}`,
  pageSize: "Rows per page",
  pageSizeOption: (size) => `${size} / page`,
  total: (total) => `${total} items`,
};
export interface LiquidGlassConfig {
  locale: Locale;
  density: "comfortable" | "compact";
  direction: "ltr" | "rtl";
}
const ConfigContext = createContext<LiquidGlassConfig>({
  locale: zhCN,
  density: "comfortable",
  direction: "ltr",
});
export function useConfig(): LiquidGlassConfig {
  return useContext(ConfigContext);
}

export interface ConfigProviderProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "dir"
> {
  children: ReactNode;
  locale?: Partial<Locale>;
  density?: LiquidGlassConfig["density"];
  direction?: LiquidGlassConfig["direction"];
  theme?: "light" | "dark";
  /** 仅覆盖显式指定的 CSS token，例如 --lg-fill、--lg-foreground。 */
  tokens?: Record<`--lg-${string}`, string | number>;
}
export function ConfigProvider({
  locale,
  density,
  direction,
  theme,
  tokens,
  children,
  style,
  ...props
}: ConfigProviderProps): JSX.Element {
  const parent = useConfig();
  const config = useMemo(
    () => ({
      locale: { ...parent.locale, ...locale },
      density: density ?? parent.density,
      direction: direction ?? parent.direction,
    }),
    [parent, locale, density, direction],
  );
  return (
    <ConfigContext.Provider value={config}>
      <div
        {...props}
        dir={config.direction}
        data-theme={theme}
        data-lg-density={config.density}
        style={{ ...tokens, ...style } as CSSProperties}
      >
        {children}
      </div>
    </ConfigContext.Provider>
  );
}
