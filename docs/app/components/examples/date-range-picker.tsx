import { useState } from "react";
import { Button, DateRangePicker } from "@lec-space/liquidglass";
export default function Example() {
  const [result, setResult] = useState("选择日期后提交");
  return (
    <form
      style={{ display: "grid", gap: 20 }}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setResult(String(data.get("start")) + " 至 " + String(data.get("end")));
      }}
    >
      <DateRangePicker
        names={{ start: "start", end: "end" }}
        defaultValue={{ start: "2026-11-01", end: "2026-11-11" }}
        today="2026-11-11"
        min="2026-11-01"
        max="2026-12-20"
        required
      />
      <div style={{ display: "flex", gap: 10 }}>
        <Button type="submit">查询记录</Button>
        <Button type="reset">重置日期</Button>
      </div>
      <output>{result}</output>
    </form>
  );
}
