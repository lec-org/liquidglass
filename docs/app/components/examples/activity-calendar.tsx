import { useState } from "react";
import { ActivityCalendar } from "@lec-org/liquidglass";
import styles from "./activity-calendar.module.css";
export default function Example() {
  const [month, setMonth] = useState("2026-11");
  const [date, setDate] = useState("2026-11-11");
  const days = [2, 5, 8, 10, 11, 14, 19].map((day) => ({
    date: month + "-" + String(day).padStart(2, "0"),
    value: (day % 5) + 1,
    label: `${(day % 5) + 1} 次提交`,
  }));
  const selected = days.find((day) => day.date === date);
  const detail = date
    ? `${Number(date.slice(5, 7))} 月 ${Number(date.slice(8))} 日 · ${selected?.label ?? "暂无提交"}`
    : "选择一天查看练习记录";
  return (
    <div className={styles.example}>
      <ActivityCalendar
        aria-label="练习活动"
        month={month}
        days={days}
        selectedDate={date}
        today="2026-11-11"
        onDateSelect={setDate}
        onMonthChange={(next) => {
          setMonth(next);
          setDate("");
        }}
      />
      <output className={styles.detail}>
        {date && <span className={styles.dot} aria-hidden="true" />}
        {detail}
      </output>
    </div>
  );
}
