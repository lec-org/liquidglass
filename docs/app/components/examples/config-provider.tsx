import { useState } from "react";
import {
  Button,
  ConfigProvider,
  enUS,
  Pagination,
  Table,
} from "@lec-space/liquidglass";

export default function Example() {
  const [english, setEnglish] = useState(false);
  return (
    <div style={{ width: "100%", display: "grid", gap: 16 }}>
      <Button onClick={() => setEnglish(!english)}>切换界面语言</Button>
      <ConfigProvider locale={english ? enUS : undefined} density="compact">
        <Table
          caption="配置预览"
          data={[]}
          columns={[
            {
              key: "name",
              title: "Name",
              render: (row: { name: string }) => row.name,
            },
          ]}
          rowKey={(row) => row.name}
        />
        <Pagination total={24} page={1} onPageChange={() => {}} />
      </ConfigProvider>
    </div>
  );
}
