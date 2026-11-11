import { useId, useState } from "react";
import { Button, TextArea } from "@lec-space/liquidglass";

export default function Example() {
  const id = useId();
  const [saved, setSaved] = useState("");
  return (
    <form
      style={{ width: "min(100%, 380px)", display: "grid", gap: 14 }}
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(String(new FormData(event.currentTarget).get("notes")));
      }}
      onReset={() => setSaved("")}
    >
      <label htmlFor={id} style={{ fontWeight: 600 }}>
        解题笔记
      </label>
      <TextArea
        id={id}
        name="notes"
        placeholder="记录你的思路、复杂度和容易遗漏的边界条件……"
        maxLength={120}
        showCount
        rows={4}
        required
      />
      <div style={{ display: "flex", gap: 10 }}>
        <Button type="submit" variant="filled">
          保存笔记
        </Button>
        <Button type="reset">清空</Button>
      </div>
      {saved && (
        <output style={{ fontSize: 12, overflowWrap: "anywhere" }}>
          已保存：{saved}
        </output>
      )}
    </form>
  );
}
