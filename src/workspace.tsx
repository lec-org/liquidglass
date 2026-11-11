/** 可选分栏工作区，复用项目已有的面板引擎；从独立 workspace 入口按需加载。 */
import "./style-entry";
import { Fragment, type JSX, type ReactNode } from "react";
import {
  Group,
  Panel,
  Separator,
  type Layout,
  type PanelProps,
} from "react-resizable-panels";
import { Button } from "./button";

export interface WorkspacePanel {
  id: string;
  title: ReactNode;
  content: ReactNode;
  defaultSize?: PanelProps["defaultSize"];
  minSize?: PanelProps["minSize"];
  maxSize?: PanelProps["maxSize"];
  collapsible?: boolean;
}
export interface ResizableWorkspaceProps {
  panels: readonly WorkspacePanel[];
  direction?: "horizontal" | "vertical";
  defaultLayout?: Layout;
  onLayoutChange?: (layout: Layout) => void;
  onReset?: () => void;
  "aria-label": string;
}
export function ResizableWorkspace({
  panels,
  direction = "horizontal",
  defaultLayout,
  onLayoutChange,
  onReset,
  "aria-label": label,
}: ResizableWorkspaceProps): JSX.Element {
  return (
    <div className="lg-workspace" aria-label={label}>
      {onReset && (
        <div className="lg-workspace-tools">
          <Button size="small" onClick={onReset}>
            重置布局
          </Button>
        </div>
      )}
      <Group
        style={{ flex: 1, minHeight: 0 }}
        orientation={direction}
        defaultLayout={defaultLayout}
        onLayoutChanged={(layout) => onLayoutChange?.(layout)}
      >
        {panels.map((panel, index) => (
          <Fragment key={panel.id}>
            {index > 0 && (
              <Separator
                className="lg-workspace-separator"
                aria-label="调整分栏"
              />
            )}
            <Panel
              id={panel.id}
              defaultSize={panel.defaultSize}
              minSize={panel.minSize}
              maxSize={panel.maxSize}
              collapsible={panel.collapsible}
            >
              <section className="lg-workspace-panel">
                <header>{panel.title}</header>
                <div>{panel.content}</div>
              </section>
            </Panel>
          </Fragment>
        ))}
      </Group>
    </div>
  );
}
