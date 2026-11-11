/** 视觉规范页的同屏对照示例，用于回归控件尺寸、状态色、密度、玻璃材质与浮层。 */
import { useRef, useState } from "react";
import {
  Button,
  ConfigProvider,
  Dialog,
  FormField,
  Input,
  Message,
  Popover,
  Select,
  Table,
  Tabs,
  Tag,
  Typography,
  type TableColumn,
} from "@lec-org/liquidglass";
import { Search, Settings2 } from "lucide-react";
import styles from "./visual-system.module.css";

interface Member {
  id: string;
  name: string;
  state: string;
  tone: "success" | "warning" | "danger";
}
const members: Member[] = [
  { id: "01", name: "林同学", state: "已完成", tone: "success" },
  { id: "02", name: "陈同学", state: "待处理", tone: "warning" },
  { id: "03", name: "周同学", state: "需修改", tone: "danger" },
];
const columns: TableColumn<Member>[] = [
  { key: "id", title: "编号", render: (row) => row.id },
  { key: "name", title: "成员", render: (row) => row.name },
  {
    key: "state",
    title: "状态",
    render: (row) => <Tag tone={row.tone}>{row.state}</Tag>,
  },
];
const roles = [
  { value: "member", label: "正式成员" },
  { value: "mentor", label: "导师" },
];

export default function Example() {
  const trigger = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("member");
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("修改会自动保存在当前设备。");
  const form = (
    <div className={styles.fields} data-testid="regular-controls">
      <FormField label="查找成员">
        {(control) => (
          <Input
            {...control}
            icon={<Search />}
            placeholder="输入姓名"
            value={query}
            onValueChange={setQuery}
          />
        )}
      </FormField>
      <FormField label="成员角色">
        {(control) => (
          <Select
            {...control}
            value={role}
            onValueChange={setRole}
            options={roles}
          />
        )}
      </FormField>
      <Button variant="filled" onClick={() => setNotice("已保存当前设置。")}>
        保存设置
      </Button>
    </div>
  );
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div>
          <Typography as="h2">同一套语言，不同的层次</Typography>
          <p className={styles.muted}>尺寸、状态与反馈，共享一套视觉规则。</p>
        </div>
        <Tag tone="success">已同步</Tag>
      </header>
      <Tabs
        aria-label="设置分类"
        defaultValue="members"
        items={[
          { value: "members", label: "成员设置", content: form },
          {
            value: "activity",
            label: "最近活动",
            content: <Message>今天有 3 位成员更新了练习记录。</Message>,
          },
          { value: "audit", label: "审核记录", disabled: true, content: null },
        ]}
      />
      <Message>{notice}</Message>
      <section className={styles.section} aria-label="尺寸与密度">
        <h3>尺寸与密度</h3>
        <div className={styles.row} data-testid="button-sizes">
          <Button size="small">小号 32</Button>
          <Button>常规 40</Button>
          <Button size="large">大号 48</Button>
          <Button icon={<Settings2 />} aria-label="调整设置" />
          <Button destructive variant="filled">
            移除成员
          </Button>
        </div>
        <ConfigProvider density="compact">
          <div className={styles.compact} data-testid="compact-controls">
            <Input aria-label="紧凑搜索" placeholder="紧凑搜索" />
            <Select
              aria-label="紧凑角色"
              options={roles}
              defaultValue="member"
            />
            <Button>应用筛选</Button>
          </div>
        </ConfigProvider>
      </section>
      <section className={styles.section} aria-label="状态与反馈">
        <h3>状态与反馈</h3>
        <div className={styles.row} data-testid="semantic-text">
          <Typography tone="success">已完成</Typography>
          <Typography tone="warning">待处理</Typography>
          <Typography tone="danger">需修改</Typography>
        </div>
        <div className={styles.states}>
          <FormField label="名称校验" error="请输入至少两个字符。">
            {(control) => <Input {...control} defaultValue="林" />}
          </FormField>
          <Input aria-label="禁用字段" disabled value="只读资料" />
          <Button disabled>暂不可用</Button>
          <Button loading>保存中</Button>
        </div>
      </section>
      <section className={styles.section} aria-label="内容与浮层">
        <div className={styles.header}>
          <h3>内容与浮层</h3>
          <div className={styles.row}>
            <Popover aria-label="显示选项" label="显示选项" align="end">
              <Typography>浮层继承当前的主题与字体。</Typography>
            </Popover>
            <Button ref={trigger} onClick={() => setOpen(true)}>
              预览详情
            </Button>
          </div>
        </div>
        <Table
          caption="成员状态对照"
          columns={columns}
          data={members}
          rowKey={(row) => row.id}
        />
      </section>
      <Dialog
        returnFocusRef={trigger}
        open={open}
        onOpenChange={setOpen}
        title="成员资料"
        description="内容清晰，操作保留玻璃材质。"
        footer={
          <>
            <Button onClick={() => setOpen(false)}>取消</Button>
            <Button variant="filled" onClick={() => setOpen(false)}>
              完成
            </Button>
          </>
        }
      >
        <FormField label="展示名称">
          {(control) => <Input {...control} defaultValue="林同学" />}
        </FormField>
      </Dialog>
    </div>
  );
}
