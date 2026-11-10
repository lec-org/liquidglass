import { useState } from "react";
import { Button, ToastProvider, useToast } from "@lec-org/liquidglass";

function Actions() {
  const { toast, dismissAll } = useToast();
  const [result, setResult] = useState(
    "悬停通知可暂停倒计时。最多同时显示 3 条。",
  );
  return (
    <div style={{ display: "grid", gap: 20, width: "min(100%, 380px)" }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Button
          onClick={() =>
            toast({
              title: "笔记已保存",
              description: "下次打开题目时可以继续编辑。",
              tone: "success",
            })
          }
        >
          保存成功
        </Button>
        <Button
          onClick={() =>
            toast({
              title: "连接已中断",
              description: "请检查网络后重试。",
              tone: "error",
            })
          }
        >
          错误提示
        </Button>
        <Button
          onClick={() => toast({ title: "草稿尚未提交", tone: "warning" })}
        >
          提醒
        </Button>
        <Button
          onClick={() =>
            toast({
              title: "题目已移出收藏",
              duration: 0,
              action: {
                label: "撤销",
                onClick: () => setResult("已恢复收藏。"),
              },
            })
          }
        >
          带操作 · 常驻
        </Button>
        <Button
          onClick={() => {
            for (let i = 1; i <= 4; i++)
              toast({ title: `第 ${i} 条通知`, duration: 2000 });
          }}
        >
          排队显示 4 条
        </Button>
        <Button onClick={dismissAll}>清空通知</Button>
      </div>
      <output style={{ fontSize: 12 }}>{result}</output>
    </div>
  );
}

export default function Example() {
  return (
    <ToastProvider position="bottom-right" maxVisible={3}>
      <Actions />
    </ToastProvider>
  );
}
