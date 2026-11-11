/** 层级资源导航，支持方向键、受控展开与选中；权限和加载由业务决定。 */
import {
  useMemo,
  useState,
  type JSX,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useControllable } from "./internal/controllable";
import { TreeBranch } from "./internal/tree-branch";
import { useConfig } from "./config-provider";

export interface TreeNode {
  key: string;
  label: ReactNode;
  children?: readonly TreeNode[];
  disabled?: boolean;
}
export interface TreeProps {
  nodes: readonly TreeNode[];
  selectedKey?: string;
  onSelect?: (key: string) => void;
  expandedKeys?: readonly string[];
  defaultExpandedKeys?: readonly string[];
  onExpandedChange?: (keys: string[]) => void;
  "aria-label": string;
}
interface VisibleNode {
  node: TreeNode;
  parent?: string;
}
function visibleNodes(
  nodes: readonly TreeNode[],
  expanded: ReadonlySet<string>,
  parent?: string,
): VisibleNode[] {
  return nodes.flatMap((node) => [
    { node, parent },
    ...(node.children && expanded.has(node.key)
      ? visibleNodes(node.children, expanded, node.key)
      : []),
  ]);
}
export function Tree({
  nodes,
  selectedKey,
  onSelect,
  expandedKeys,
  defaultExpandedKeys = [],
  onExpandedChange,
  "aria-label": label,
}: TreeProps): JSX.Element {
  const { direction } = useConfig();
  const [expanded, setExpanded] = useControllable<readonly string[], string[]>(
    expandedKeys,
    defaultExpandedKeys,
    onExpandedChange,
  );
  const [selected, select] = useControllable(selectedKey, "", onSelect);
  const [focus, setFocus] = useState("");
  const keys = useMemo(() => new Set(expanded), [expanded]);
  const visible = visibleNodes(nodes, keys);
  const active = visible.some(({ node }) => node.key === focus)
    ? focus
    : (visible.find(({ node }) => node.key === selected)?.node.key ??
      visible[0]?.node.key);
  function toggle(key: string) {
    setExpanded(
      keys.has(key)
        ? expanded.filter((item) => item !== key)
        : [...expanded, key],
    );
  }
  function navigate(event: KeyboardEvent<HTMLUListElement>) {
    const target = (event.target as HTMLElement).closest<HTMLElement>(
      '[role="treeitem"]',
    );
    const index = visible.findIndex(
      ({ node }) => node.key === target?.dataset.key,
    );
    const item = visible[index];
    if (!item) return;
    let next: string | undefined;
    if (event.key === "ArrowDown") next = visible[index + 1]?.node.key;
    if (event.key === "ArrowUp") next = visible[index - 1]?.node.key;
    if (event.key === "Home") next = visible[0]?.node.key;
    if (event.key === "End") next = visible.at(-1)?.node.key;
    const expandKey = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
    const collapseKey = direction === "rtl" ? "ArrowRight" : "ArrowLeft";
    if (
      event.key === expandKey &&
      item.node.children?.length &&
      !item.node.disabled
    ) {
      if (!keys.has(item.node.key)) toggle(item.node.key);
      else next = item.node.children[0]?.key;
    }
    if (event.key === collapseKey && !item.node.disabled) {
      if (keys.has(item.node.key)) toggle(item.node.key);
      else next = item.parent;
    }
    if ((event.key === "Enter" || event.key === " ") && !item.node.disabled)
      select(item.node.key);
    if (
      [
        "ArrowDown",
        "ArrowUp",
        "Home",
        "End",
        "ArrowRight",
        "ArrowLeft",
        "Enter",
        " ",
      ].includes(event.key)
    )
      event.preventDefault();
    if (next) {
      setFocus(next);
      const rows =
        event.currentTarget.querySelectorAll<HTMLElement>('[role="treeitem"]');
      [...rows].find((row) => row.dataset.key === next)?.focus();
    }
  }
  return (
    <ul className="lg-tree" role="tree" aria-label={label} onKeyDown={navigate}>
      {nodes.map((node) => (
        <TreeBranch
          key={node.key}
          node={node}
          selected={selected}
          active={active}
          expanded={keys}
          onToggle={toggle}
          onSelect={select}
          onFocus={setFocus}
        />
      ))}
    </ul>
  );
}
