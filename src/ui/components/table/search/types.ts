import { SelectOption } from "../../forms/fields/Select";

export type TableSearchType = "text" | "select";

export interface TableSearchFieldProps {
  dataKey: string;
  searchType: TableSearchType;
  selectOptions: SelectOption[];
}
