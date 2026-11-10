import { useEffect, useRef, useState } from "react";
import { Avatar, Button, Card, Skeleton, Tag } from "@lec-org/liquidglass";

export default function Example() {
  const [loading, setLoading] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div style={{ width: "min(100%, 360px)", display: "grid", gap: 20 }}>
      <Card aria-busy={loading}>
        {loading ? (
          <div style={{ display: "grid", gap: 14 }}>
            <span
              role="status"
              style={{ fontSize: 12, color: "var(--lg-secondary)" }}
            >
              正在加载练习计划……
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Skeleton shape="circle" width={44} height={44} />
              <Skeleton width="55%" height={18} />
            </div>
            <Skeleton />
            <Skeleton width="82%" />
            <Skeleton width="64%" />
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Avatar name="Lec" />
              <strong>今天，也有一点进步。</strong>
            </div>
            <span>完成一次专注练习，比等待完美的时机更有意义。</span>
            <Tag tone="success">练习计划已就绪</Tag>
          </div>
        )}
      </Card>
      <Button
        onClick={() => {
          clearTimeout(timer.current);
          setLoading(true);
          timer.current = setTimeout(() => setLoading(false), 1200);
        }}
      >
        模拟加载完成
      </Button>
    </div>
  );
}
