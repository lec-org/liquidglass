import { Button, Toolbar, ToolbarGroup } from "@lec-org/liquidglass";
import { ArrowLeft, Plus, Share2 } from "lucide-react";

export default function Example() {
  return (
    <Toolbar
      aria-label="文档工具栏"
      style={{ width: "100%", position: "relative" }}
    >
      <ToolbarGroup>
        <Button icon={<ArrowLeft size={18} />} aria-label="返回" />
      </ToolbarGroup>
      <span style={{ margin: "auto" }}>灵感笔记</span>
      <ToolbarGroup>
        <Button icon={<Plus size={18} />} aria-label="新建笔记" />
        <Button icon={<Share2 size={18} />} aria-label="分享笔记" />
      </ToolbarGroup>
    </Toolbar>
  );
}
