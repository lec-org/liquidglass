/** Tree 的递归节点，隔离层级渲染与根组件的键盘导航逻辑。 */
import { useId, type JSX } from "react";
import type { TreeNode } from "../tree";

export interface TreeBranchProps {
  node: TreeNode;
  selected: string;
  active?: string;
  expanded: ReadonlySet<string>;
  onToggle: (key: string) => void;
  onSelect: (key: string) => void;
  onFocus: (key: string) => void;
}
export function TreeBranch({
  node,
  selected,
  active,
  expanded,
  onToggle,
  onSelect,
  onFocus,
}: TreeBranchProps): JSX.Element {
  const labelId = useId();
  const branch = !!node.children?.length;
  const open = expanded.has(node.key);
  return (
    <li
      role="treeitem"
      data-key={node.key}
      aria-labelledby={labelId}
      aria-selected={selected === node.key}
      aria-expanded={branch ? open : undefined}
      aria-disabled={node.disabled || undefined}
      tabIndex={active === node.key ? 0 : -1}
      onFocus={(event) => {
        if (event.target === event.currentTarget) onFocus(node.key);
      }}
      onClick={(event) => {
        event.stopPropagation();
        event.currentTarget.focus();
        if (!node.disabled) onSelect(node.key);
      }}
    >
      <div className="lg-tree-row">
        <span
          className="lg-tree-expander"
          aria-hidden="true"
          onClick={(event) => {
            event.stopPropagation();
            if (branch && !node.disabled) onToggle(node.key);
          }}
        >
          {branch ? (open ? "▾" : "▸") : "·"}
        </span>
        <span id={labelId}>{node.label}</span>
      </div>
      {branch && open && (
        <ul role="group">
          {node.children!.map((child) => (
            <TreeBranch
              key={child.key}
              node={child}
              selected={selected}
              active={active}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
              onFocus={onFocus}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
