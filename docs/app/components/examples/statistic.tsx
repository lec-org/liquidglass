import { Statistic } from "@lec-org/liquidglass";
export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
      <Statistic
        title="本周提交"
        value={128}
        suffix="次"
        description="较上周增加 18 次"
      />
      <Statistic title="活跃成员" value={32} suffix="人" />
      <Statistic
        title="累计时长"
        value={1240}
        formatter={(value) => Number(value).toLocaleString("zh-CN")}
        suffix="小时"
      />
    </div>
  );
}
