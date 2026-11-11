import { useState } from "react";
import { Button, FilterBar, Input, Select } from "@lec-org/liquidglass";
export default function Example() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [result, setResult] = useState("全部成员");
  return (
    <div style={{ display: "grid", gap: 20, width: "100%" }}>
      <FilterBar
        onClear={() => {
          setQuery("");
          setStatus("");
          setResult("全部成员");
        }}
        onSubmit={(event) => {
          event.preventDefault();
          setResult((query || "全部成员") + " · " + (status || "全部状态"));
        }}
        actions={
          <Button type="submit" variant="filled">
            查询成员
          </Button>
        }
      >
        <Input
          aria-label="搜索成员"
          placeholder="姓名或学号"
          value={query}
          onValueChange={setQuery}
        />
        <Select
          aria-label="成员状态"
          value={status}
          onValueChange={setStatus}
          placeholder="全部状态"
          options={[
            { value: "active", label: "正式成员" },
            { value: "new", label: "新成员" },
          ]}
        />
      </FilterBar>
      <output>{result}</output>
    </div>
  );
}
