import { GridCellProps } from "@progress/kendo-react-grid";
import { cellTemplateMapping } from "./config";
import { Default } from "./Default";

export const RenderCustomCell = (props: GridCellProps, cellTemplate: string) => {
  const template = cellTemplateMapping[cellTemplate];
  if (props.rowType === "groupHeader") {
    return null;
  }
  if (template) {
    return template(props);
  }
  return Default(props);
};
