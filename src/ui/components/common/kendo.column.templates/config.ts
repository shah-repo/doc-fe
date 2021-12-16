import { CommonCell } from "./CommonCell";
import { DateCompleted } from "./DateCompleted";
import { DateInfo } from "./DateInfo";
import { Status } from "./Status";
import { UserAvatar } from "./UserAvatar";

const cellTemplateMapping = {
  UserAvatar,
  Status,
  DateCompleted,
  DateInfo,
  CommonCell,
};

export const getCellTemplate = (templateName: string) => {
  const template = cellTemplateMapping[templateName];
  if (template) {
    return template;
  }
  return null;
};
