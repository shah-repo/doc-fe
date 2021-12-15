import { DateCompleted } from "./DateCompleted";
import { DateInfo } from "./DateInfo";
import { Status } from "./Status";
import { UserAvatar } from "./UserAvatar";

const cellTemplateMapping = {
  UserAvatar,
  Status,
  DateCompleted,
  DateInfo,
};

export const getCellTemplate = (templateName: string) => {
  console.log("getCellTemplate :: templateName = ", templateName);
  const template = cellTemplateMapping[templateName];
  console.log("getCellTemplate :: template = ", template);
  if (template) {
    return template;
  }
  return null;
};
