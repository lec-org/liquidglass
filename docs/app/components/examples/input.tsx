import { useState } from "react";
import { Input } from "@lec-space/liquidglass";
import { UserRound } from "lucide-react";

export default function Example() {
  const [name, setName] = useState("");
  return (
    <div style={{ width: 280, display: "grid", gap: 16 }}>
      <Input
        aria-label="你的名字"
        placeholder="你的名字"
        icon={<UserRound size={18} />}
        value={name}
        onValueChange={setName}
      />
      <output>{name ? `你好，${name}` : "写下名字，开始一段新旅程。"}</output>
    </div>
  );
}
