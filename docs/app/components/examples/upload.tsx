import { useState } from "react";
import { Upload } from "@lec-org/liquidglass";
export default function Example() {
  const [files, setFiles] = useState<readonly File[]>([]);
  return (
    <div style={{ display: "grid", gap: 14, width: "min(100%, 420px)" }}>
      <Upload
        aria-label="选择文档"
        accept=".txt,.md"
        multiple
        maxFiles={3}
        maxBytes={1024 * 1024}
        value={files}
        onValueChange={setFiles}
      />
      <output>已选择 {files.length} 个文件 · 每个文件上限 1 MiB</output>
    </div>
  );
}
