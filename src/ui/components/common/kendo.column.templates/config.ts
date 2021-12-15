import { Status } from "./Status";
import { UserAvatar } from "./UserAvatar";

const cellTemplateMapping = {
  UserAvatar,
  Status,
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
