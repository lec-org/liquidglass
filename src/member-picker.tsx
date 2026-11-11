/** 成员选择组合，仅展示传入的成员资料；搜索和权限范围由接入项目控制。 */
import type { JSX } from "react";
import { Avatar } from "./avatar";
import { MultiSelect, type MultiSelectProps } from "./multi-select";

export interface MemberOption {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  group?: string;
  disabled?: boolean;
}
export interface MemberPickerProps extends Omit<MultiSelectProps, "options"> {
  members: readonly MemberOption[];
}
export function MemberPicker({
  members,
  ...props
}: MemberPickerProps): JSX.Element {
  const options = members.map((member) => ({
    value: member.id,
    label: member.name,
    description: member.description,
    group: member.group,
    disabled: member.disabled,
    icon: (
      <Avatar
        src={member.avatar}
        name={member.name}
        size="small"
        aria-hidden="true"
      />
    ),
  }));
  return <MultiSelect {...props} options={options} />;
}
