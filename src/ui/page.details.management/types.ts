import { Nullable } from "../../state/ducks/common";

export interface PageDetailsCategory {
  category: string;
  addNewBtnLabel: string;
  columns: Nullable<string>;
}
