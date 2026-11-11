import { useState } from "react";
import { Button, MultiSelect } from "@lec-space/liquidglass";
export default function Example() {
  const [result, setResult] = useState("最多选择 3 项");
  return (
    <form
      style={{ display: "grid", gap: 18, width: "min(100%, 350px)" }}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(
          new FormData(event.currentTarget).getAll("skills").join("、") ||
            "未选择",
        );
      }}
    >
      <MultiSelect
        aria-label="选择技术方向"
        name="skills"
        placeholder="选择技术方向"
        required
        maxSelected={3}
        options={[
          { value: "react", label: "React", group: "前端" },
          { value: "vue", label: "Vue", group: "前端" },
          { value: "nestjs", label: "NestJS", group: "后端" },
          { value: "go", label: "Go", group: "后端" },
          { value: "legacy", label: "旧版课程", disabled: true, group: "其他" },
        ]}
      />
      <div style={{ display: "flex", gap: 10 }}>
        <Button type="submit">保存方向</Button>
        <Button type="reset">重置方向</Button>
      </div>
      <output>{result}</output>
    </form>
  );
}
