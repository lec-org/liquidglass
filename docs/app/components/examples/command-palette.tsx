import { useRef, useState } from "react";
import { Button, CommandPalette } from "@lec-space/liquidglass";
export default function Example() {
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState("选择常用操作");
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Button ref={trigger} onClick={() => setOpen(true)}>
        打开快捷命令
      </Button>
      <output>{result}</output>
      <CommandPalette
        returnFocusRef={trigger}
        open={open}
        onOpenChange={setOpen}
        commands={[
          {
            id: "members",
            title: "打开成员列表",
            description: "管理工作室成员",
            group: "工作室",
            onSelect: () => setResult("已选择成员列表"),
          },
          {
            id: "create",
            title: "新建文档",
            group: "文档",
            keywords: ["create", "document"],
            onSelect: () => setResult("已选择新建文档"),
          },
          {
            id: "settings",
            title: "管理员设置",
            group: "设置",
            disabled: true,
            onSelect: () => {},
          },
        ]}
      />
    </div>
  );
}
