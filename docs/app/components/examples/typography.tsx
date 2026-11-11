import { Typography } from "@lec-org/liquidglass";

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Typography as="h2">把注意力，留给内容。</Typography>
      <Typography>正文与控件共用语义颜色，局部深色主题同样清晰。</Typography>
      <Typography tone="muted" size="small">
        上次更新于今天 · 3 分钟阅读
      </Typography>
      <Typography tone="success" weight="semibold">
        所有改动已保存
      </Typography>
      <Typography as="code" size="small">
        npm install @lec-org/liquidglass
      </Typography>
    </div>
  );
}
