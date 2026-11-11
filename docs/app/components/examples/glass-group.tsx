import { Button, GlassGroup } from "@lec-space/liquidglass";
import { Heart, Plus, Share2 } from "lucide-react";

export default function Example() {
  return (
    <GlassGroup spacing={24} style={{ display: "flex", gap: 10 }}>
      <Button icon={<Heart size={18} />} aria-label="收藏" />
      <Button icon={<Plus size={18} />} aria-label="添加" />
      <Button icon={<Share2 size={18} />} aria-label="分享" />
    </GlassGroup>
  );
}
