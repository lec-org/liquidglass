import { useState } from "react";
import { Button, ConfigProvider, Input, Tabs } from "@lec-org/liquidglass";
export default function Example() {
  const [rtl, setRtl] = useState(false);
  return (
    <div style={{ display: "grid", gap: 16, width: "100%" }}>
      <Button size="small" onClick={() => setRtl(!rtl)}>
        切换阅读方向
      </Button>
      <ConfigProvider direction={rtl ? "rtl" : "ltr"}>
        <Tabs
          aria-label="成员资料"
          items={[
            {
              value: "profile",
              label: "基本资料",
              content: (
                <Input
                  aria-label="个人签名"
                  placeholder="切换标签后输入仍保留"
                />
              ),
            },
            {
              value: "activity",
              label: "近期活动",
              content: <p>本周参与了 3 次工作室活动。</p>,
            },
            {
              value: "locked",
              label: "审核记录",
              content: null,
              disabled: true,
            },
          ]}
        />
      </ConfigProvider>
    </div>
  );
}
