import { FBTemplateSchema } from "./store";

export type FBSortableType = "inactive" | "active";

export interface FBSortableProps {
  items: FBTemplateSchema[];
}
