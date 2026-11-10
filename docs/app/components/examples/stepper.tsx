import { useState } from "react";
import { Stepper } from "@lec-org/liquidglass";

export default function Example() {
  const [count, setCount] = useState(2);
  return (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <span>
        访客 <output>{count}</output> 人
      </span>
      <Stepper
        aria-label="访客人数"
        value={count}
        onValueChange={setCount}
        min={1}
        max={8}
      />
    </div>
  );
}
