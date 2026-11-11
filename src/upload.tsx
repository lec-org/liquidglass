/** 文件选择与拖放入口，校验大小、数量和类型，网络上传由接入项目处理。 */
import { useRef, useState, type JSX } from "react";
import { Button } from "./button";
import { Message } from "./message";
import { useControllable } from "./internal/controllable";
import { useFormReset } from "./internal/form-reset";
import { Progress } from "./progress";
import { useConfig } from "./config-provider";

export interface UploadProps {
  value?: readonly File[];
  defaultValue?: readonly File[];
  onValueChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxBytes?: number;
  disabled?: boolean;
  progress?: number;
  "aria-label": string;
}
function accepts(file: File, accept?: string): boolean {
  if (!accept) return true;
  return accept.split(",").some((token) => {
    const type = token.trim().toLowerCase();
    if (type.startsWith(".")) return file.name.toLowerCase().endsWith(type);
    if (type.endsWith("/*"))
      return file.type.toLowerCase().startsWith(type.slice(0, -1));
    return file.type.toLowerCase() === type;
  });
}
export function Upload({
  value,
  defaultValue = [],
  onValueChange,
  accept,
  multiple = false,
  maxFiles = multiple ? 10 : 1,
  maxBytes = 8 * 1024 * 1024,
  disabled,
  progress,
  "aria-label": label,
}: UploadProps): JSX.Element {
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useControllable<readonly File[], File[]>(
    value,
    defaultValue,
    onValueChange,
  );
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const { locale } = useConfig();
  useFormReset(input, () => {
    setError("");
    if (value === undefined) setFiles([...defaultValue]);
  });
  function receive(batch: readonly File[]) {
    if (disabled) return;
    const next = multiple ? [...files, ...batch] : [...batch];
    if (next.length > maxFiles) {
      setError(locale.tooManyFiles(maxFiles));
      return;
    }
    const invalid = next.find(
      (file) => file.size > maxBytes || !accepts(file, accept),
    );
    if (invalid) {
      setError(locale.invalidFile(invalid.name));
      return;
    }
    setError("");
    setFiles(next);
  }
  return (
    <div
      className="lg-upload"
      data-dragging={dragging || undefined}
      aria-label={label}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        receive([...event.dataTransfer.files]);
      }}
    >
      <input
        ref={input}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="lg-sr-only"
        tabIndex={-1}
        aria-label={label}
        onChange={(event) => {
          receive([...(event.target.files ?? [])]);
          event.target.value = "";
        }}
      />
      <Button disabled={disabled} onClick={() => input.current?.click()}>
        {label}
      </Button>
      <p className="lg-muted">{locale.dropFiles}</p>
      {error && <Message tone="error">{error}</Message>}
      <ul className="lg-upload-files">
        {files.map((file, index) => (
          <li key={file.name + file.lastModified + index}>
            <span>
              {file.name}{" "}
              <small className="lg-muted">
                {Math.ceil(file.size / 1024)} KiB
              </small>
            </span>
            <Button
              size="small"
              disabled={disabled}
              aria-label={locale.clear + " " + file.name}
              onClick={() => setFiles(files.filter((_, at) => at !== index))}
            >
              ×
            </Button>
          </li>
        ))}
      </ul>
      {progress !== undefined && (
        <Progress value={progress} aria-label={label + "进度"} />
      )}
    </div>
  );
}
