import { useState } from "react";
import { Slider } from "@lec-org/liquidglass";

export default function Example() {
  const [volume, setVolume] = useState(64);
  return (
    <div style={{ width: 280, display: "grid", gap: 18 }}>
      <label htmlFor="volume-demo">
        音量 <output>{volume}%</output>
      </label>
      <Slider
        id="volume-demo"
        value={volume}
        onValueChange={setVolume}
        min={0}
        max={100}
      />
    </div>
  );
}
