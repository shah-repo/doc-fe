import { ReactNode } from "react";
import { SortEnd } from "react-sortable-hoc";
import { FBTemplateSchema } from "./store";

export type FBSortableType = "inactive" | "active";

export interface FBSortableProps {
  items: FBTemplateSchema[];
  wrapperRenderer: (schema: FBTemplateSchema) => ReactNode;
  onSortEnd: (sortEnd: SortEnd) => any;
  onSortStart: () => any;
  isSortable: () => boolean;
}
