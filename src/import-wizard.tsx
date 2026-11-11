/** 文件导入流程。解析和发布由回调提供，状态分支保留当前文件与预览。 */
import { useEffect, useRef, useState, type JSX, type ReactNode } from "react";
import { Button } from "./button";
import { Message } from "./message";
import { Upload } from "./upload";

type ImportState<T> =
  | { phase: "choose" }
  | { phase: "inspecting" }
  | { phase: "ready"; preview: T }
  | { phase: "publishing"; preview: T }
  | { phase: "finished" };
export interface ImportWizardProps<T> {
  inspect: (files: readonly File[], signal: AbortSignal) => Promise<T>;
  publish: (preview: T, signal: AbortSignal) => Promise<void>;
  renderPreview: (preview: T) => ReactNode;
  accept?: string;
  maxBytes?: number;
  title?: ReactNode;
}
export function ImportWizard<T>({
  inspect,
  publish,
  renderPreview,
  accept = ".zip",
  maxBytes,
  title = "导入文件",
}: ImportWizardProps<T>): JSX.Element {
  const [files, setFiles] = useState<readonly File[]>([]);
  const [state, setState] = useState<ImportState<T>>({ phase: "choose" });
  const [error, setError] = useState("");
  const operation = useRef<AbortController | null>(null);
  useEffect(() => () => operation.current?.abort(), []);
  async function inspectFiles() {
    const controller = new AbortController();
    operation.current?.abort();
    operation.current = controller;
    setError("");
    setState({ phase: "inspecting" });
    try {
      const preview = await inspect(files, controller.signal);
      if (!controller.signal.aborted) setState({ phase: "ready", preview });
    } catch (reason) {
      if (!controller.signal.aborted) {
        setError(reason instanceof Error ? reason.message : "预检失败，请重试");
        setState({ phase: "choose" });
      }
    }
  }
  async function publishFiles() {
    if (state.phase !== "ready") return;
    const preview = state.preview;
    const controller = new AbortController();
    operation.current = controller;
    setError("");
    setState({ phase: "publishing", preview });
    try {
      await publish(preview, controller.signal);
      if (!controller.signal.aborted) setState({ phase: "finished" });
    } catch (reason) {
      if (!controller.signal.aborted) {
        setError(reason instanceof Error ? reason.message : "发布失败，请重试");
        setState({ phase: "ready", preview });
      }
    }
  }
  function reset() {
    operation.current?.abort();
    setFiles([]);
    setError("");
    setState({ phase: "choose" });
  }
  const busy = state.phase === "inspecting" || state.phase === "publishing";
  const preview =
    state.phase === "ready" || state.phase === "publishing"
      ? renderPreview(state.preview)
      : null;
  return (
    <section className="lg-import-wizard" aria-busy={busy || undefined}>
      <h3>{title}</h3>
      <ol className="lg-import-steps" aria-label="导入进度">
        <li aria-current={state.phase === "choose" ? "step" : undefined}>
          1 选择文件
        </li>
        <li
          aria-current={
            state.phase === "inspecting" || state.phase === "ready"
              ? "step"
              : undefined
          }
        >
          2 预检
        </li>
        <li
          aria-current={
            state.phase === "publishing" || state.phase === "finished"
              ? "step"
              : undefined
          }
        >
          3 发布
        </li>
      </ol>
      {error && <Message tone="error">{error}</Message>}
      {(state.phase === "choose" || state.phase === "inspecting") && (
        <Upload
          aria-label="选择导入文件"
          accept={accept}
          maxBytes={maxBytes}
          disabled={busy}
          value={files}
          onValueChange={setFiles}
        />
      )}
      {preview}
      {state.phase === "finished" && <p role="status">导入完成</p>}
      <div className="lg-filter-actions">
        {(state.phase === "choose" || state.phase === "inspecting") && (
          <Button
            variant="filled"
            disabled={!files.length}
            loading={busy}
            onClick={() => void inspectFiles()}
          >
            开始预检
          </Button>
        )}
        {(state.phase === "ready" || state.phase === "publishing") && (
          <Button
            variant="filled"
            loading={busy}
            onClick={() => void publishFiles()}
          >
            确认发布
          </Button>
        )}
        {state.phase !== "publishing" && (
          <Button onClick={reset}>
            {state.phase === "finished" ? "继续导入" : "重新选择"}
          </Button>
        )}
      </div>
    </section>
  );
}
