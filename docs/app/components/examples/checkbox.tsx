import { useId, useState } from "react";
import { Checkbox } from "@lec-space/liquidglass";

export default function Example() {
  const id = useId();
  const [selected, setSelected] = useState(["题目更新"]);
  const options = ["题目更新", "提交结果", "学习提醒"];
  return (
    <fieldset
      style={{
        display: "grid",
        gap: 16,
        border: 0,
        padding: 0,
        width: "min(100%, 320px)",
      }}
    >
      <legend style={{ marginBottom: 18, fontWeight: 600 }}>
        你希望收到哪些通知？
      </legend>
      <Checkbox
        checked={selected.length === options.length}
        indeterminate={selected.length > 0 && selected.length < options.length}
        onCheckedChange={(checked) => setSelected(checked ? options : [])}
      >
        全选通知
      </Checkbox>
      {options.map((option) => (
        <Checkbox
          key={option}
          name={`${id}-notifications`}
          value={option}
          checked={selected.includes(option)}
          onCheckedChange={(checked) =>
            setSelected(
              checked
                ? [...selected, option]
                : selected.filter((item) => item !== option),
            )
          }
        >
          {option}
        </Checkbox>
      ))}
      <Checkbox disabled description="管理员设置，当前不可修改">
        系统公告
      </Checkbox>
      <output style={{ fontSize: 12 }}>已选择 {selected.length} 项</output>
    </fieldset>
  );
}
