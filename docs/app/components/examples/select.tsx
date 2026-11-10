import { useId, useState } from "react";
import { Button, Select } from "@lec-org/liquidglass";

const languages = [
  { value: "cpp", label: "C++ 20" },
  { value: "python", label: "Python 3" },
  { value: "java", label: "Java 21" },
  { value: "rust", label: "Rust · 即将开放", disabled: true },
];

export default function Example() {
  const id = useId();
  const [result, setResult] = useState(
    "支持方向键选择，也可以输入语言名称定位。",
  );
  return (
    <form
      style={{ width: "min(100%, 320px)", display: "grid", gap: 16 }}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(
          `提交值：${new FormData(event.currentTarget).get("language")}`,
        );
      }}
      onReset={() => setResult("已恢复默认选项。")}
    >
      <label htmlFor={id} style={{ fontWeight: 600 }}>
        评测语言
      </label>
      <Select
        id={id}
        aria-label="评测语言"
        name="language"
        required
        options={languages}
        placeholder="选择评测语言"
      />
      <Select
        aria-label="暂不可选的语言"
        disabled
        defaultValue="cpp"
        options={languages}
      />
      <div style={{ display: "flex", gap: 10 }}>
        <Button type="submit" variant="filled">
          确认语言
        </Button>
        <Button type="reset">重置</Button>
      </div>
      <output style={{ fontSize: 12 }}>{result}</output>
    </form>
  );
}
