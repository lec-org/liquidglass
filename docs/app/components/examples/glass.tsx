import { Glass } from "@lec-org/liquidglass";

export default function Example() {
  return (
    <Glass style={{ padding: 28, borderRadius: 28, width: 260 }}>
      <p style={{ fontSize: 12, letterSpacing: ".15em", margin: "0 0 12px" }}>
        LESS, BUT ALIVE.
      </p>
      <h3 style={{ fontSize: 26, margin: "0 0 12px" }}>让背景透进来。</h3>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        透明、折射与柔和的边缘，一层恰到好处的玻璃。
      </p>
    </Glass>
  );
}
