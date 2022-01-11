import { GridCellProperties } from "../kendo/types";
import { cellTemplateMapping } from "./config";
import { Default } from "./Default";

export const RenderCustomCell = (props: GridCellProperties, cellTemplate: string) => {
  const template = cellTemplateMapping[cellTemplate];
  if (props.rowType === "groupHeader") {
    return null;
  }
  if (template) {
    return template(props);
  }
  return Default(props);
};
