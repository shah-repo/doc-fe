import { CommonCell } from "./CommonCell";
import { DateCompleted } from "./DateCompleted";
import { DateInfo } from "./DateInfo";
import { Default } from "./Default";
import { Status } from "./Status";
import { UserAvatar } from "./UserAvatar";

const cellTemplateMapping = {
  UserAvatar,
  Status,
  DateCompleted,
  DateInfo,
  CommonCell,
};

export const RenderCustomCell = (props: any, cellTemplate: string) => {
  const template = cellTemplateMapping[cellTemplate];
  if (props.rowType === "groupHeader") {
    return null;
  }
  if (template) {
    return template(props);
  }
  return Default(props);
};
