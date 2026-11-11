import { useState } from "react";
import { Menu } from "@lec-space/liquidglass";

export default function Example() {
  const [sort, setSort] = useState("最近更新");
  return (
    <Menu
      aria-label="排序方式"
      label={sort}
      chevron
      items={[
        { heading: "排列方式" },
        ...["最近更新", "名称", "创建时间"].map((label) => ({
          label,
          checked: sort === label,
          onSelect: () => setSort(label),
        })),
      ]}
    />
  );
}
