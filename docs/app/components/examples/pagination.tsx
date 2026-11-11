import { useState } from "react";
import { Pagination } from "@lec-space/liquidglass";
export default function Example() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  return (
    <div style={{ display: "grid", gap: 20, width: "100%" }}>
      <output>
        当前第 {page} 页，每页 {size} 条
      </output>
      <Pagination
        total={158}
        page={page}
        pageSize={size}
        onPageChange={setPage}
        onPageSizeChange={(next) => {
          setSize(next);
          setPage(1);
        }}
      />
    </div>
  );
}
