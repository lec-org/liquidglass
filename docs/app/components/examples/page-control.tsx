import { useState } from "react";
import { PageControl } from "@lec-space/liquidglass";

export default function Example() {
  const [page, setPage] = useState(0);
  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 24 }}>
      <p>第 {page + 1} / 5 页</p>
      <PageControl
        aria-label="示例分页"
        count={5}
        value={page}
        onValueChange={setPage}
      />
    </div>
  );
}
