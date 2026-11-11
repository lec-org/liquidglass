import { Button, Tooltip } from "@lec-space/liquidglass";
import { Bookmark, Download, Info } from "lucide-react";

export default function Example() {
  return (
    <div
      style={{
        display: "flex",
        gap: 18,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <Tooltip content="保存到收藏夹，稍后继续练习。">
        <Button icon={<Bookmark size={18} />} aria-label="收藏题目" />
      </Tooltip>
      <Tooltip content="题包包含题面、配置与测试数据。" side="bottom">
        <Button icon={<Download size={18} />}>导出说明</Button>
      </Tooltip>
      <Tooltip content="用 Tab 聚焦也能查看提示，Escape 关闭。" side="right">
        <Button icon={<Info size={18} />} aria-label="键盘操作说明" />
      </Tooltip>
    </div>
  );
}
