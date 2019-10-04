import { SelectOption } from "../../forms/fields/Select";

export type TableSearchType = "text" | "select";
export type TableSearchQueryHandler = (query: string) => any;

export interface TableSearchFieldProps {
  dataKey: string;
  searchType: TableSearchType;
  selectOptions: SelectOption[];
  searchValueGetter?: TableSearchQueryHandler;
  queryGetter?: (key: string, value: string) => any;
  defaultValue?: string;
}

export interface TableSearchQueryProps {
  query: string | number;
  searchValueGetter?: TableSearchQueryHandler;
}
