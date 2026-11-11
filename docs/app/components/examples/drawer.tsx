import { useRef, useState } from "react";
import { Button, Descriptions, Drawer, Tag } from "@lec-org/liquidglass";
export default function Example() {
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button ref={trigger} onClick={() => setOpen(true)}>
        查看成员详情
      </Button>
      <Drawer
        returnFocusRef={trigger}
        open={open}
        onOpenChange={setOpen}
        title="成员详情"
        description="保留列表位置，查看成员资料。"
        footer={
          <Button variant="filled" onClick={() => setOpen(false)}>
            完成查看
          </Button>
        }
      >
        <Descriptions
          columns={1}
          items={[
            { key: "name", label: "姓名", value: "林同学" },
            { key: "direction", label: "技术方向", value: "Web 前端" },
            { key: "status", label: "当前状态", value: <Tag>正式成员</Tag> },
          ]}
        />
      </Drawer>
    </>
  );
}
