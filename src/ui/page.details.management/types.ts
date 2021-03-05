import { Nullable } from "../../state/ducks/common/types";

export interface PageDetailsCategory {
  category: string;
  addNewBtnLabel: string;
  columns: Nullable<string>;
}
