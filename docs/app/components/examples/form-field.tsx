import { useState } from "react";
import { Button, FormField, Input } from "@lec-org/liquidglass";

export default function Example() {
  const [error, setError] = useState("");
  return (
    <form
      style={{ display: "grid", gap: 20, width: "min(100%, 360px)" }}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const value = String(
          new FormData(event.currentTarget).get("name") ?? "",
        );
        setError(value.trim() ? "" : "请填写姓名");
      }}
    >
      <FormField
        label="成员姓名"
        description="用于工作室内的成员展示"
        error={error}
        required
      >
        {(control) => (
          <Input {...control} name="name" placeholder="例如 小林" />
        )}
      </FormField>
      <Button type="submit" variant="filled">
        保存资料
      </Button>
    </form>
  );
}
