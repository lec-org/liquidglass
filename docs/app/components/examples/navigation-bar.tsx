import { useState } from "react";
import { Button, NavigationBar } from "@lec-space/liquidglass";

export default function Example() {
  const [title, setTitle] = useState("我的收藏");
  return (
    <div style={{ width: "100%" }}>
      <NavigationBar
        title={title}
        large={false}
        backLabel="返回收藏"
        onBack={() => setTitle("我的收藏")}
        trailing={<Button onClick={() => setTitle("编辑收藏")}>编辑</Button>}
      />
    </div>
  );
}
