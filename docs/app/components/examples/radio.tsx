import { useId, useState } from "react";
import { Button, Radio } from "@lec-org/liquidglass";

export default function Example() {
  const name = useId();
  const [result, setResult] = useState("选择适合自己的练习节奏。");
  return (
    <form
      style={{ width: "min(100%, 340px)", display: "grid", gap: 20 }}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(`已保存：${new FormData(event.currentTarget).get(name)}`);
      }}
      onReset={() => setResult("已恢复默认节奏。")}
    >
      <fieldset style={{ border: 0, padding: 0, display: "grid", gap: 18 }}>
        <legend style={{ marginBottom: 18, fontWeight: 600 }}>
          每天进步一点点
        </legend>
        <Radio
          name={name}
          value="轻松练习"
          defaultChecked
          description="每天 1 题，建立习惯"
        >
          轻松练习
        </Radio>
        <Radio name={name} value="专注训练" description="每天 3 题，保持手感">
          专注训练
        </Radio>
        <Radio
          name={name}
          value="团队挑战"
          disabled
          description="加入团队后开放"
        >
          团队挑战
        </Radio>
      </fieldset>
      <div style={{ display: "flex", gap: 10 }}>
        <Button type="submit" variant="filled">
          保存节奏
        </Button>
        <Button type="reset">重置</Button>
      </div>
      <output style={{ fontSize: 12 }}>{result}</output>
    </form>
  );
}
