import { useRef, useState } from "react";
import { Button, Dialog, FormField, Input } from "@lec-org/liquidglass";

export default function Example() {
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  function save() {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setSaved(true);
      setOpen(false);
    }, 500);
  }
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Button ref={trigger} onClick={() => setOpen(true)}>
        编辑资料
      </Button>
      <output>{saved ? "资料已保存" : "打开弹窗体验表单与焦点恢复"}</output>
      <Dialog
        returnFocusRef={trigger}
        open={open}
        onOpenChange={setOpen}
        title="编辑资料"
        description="保存后立即生效。"
        dismissible={!busy}
        footer={
          <>
            <Button disabled={busy} onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button loading={busy} variant="filled" onClick={save}>
              保存修改
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
