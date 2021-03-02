import { SelectOption } from "../../forms/fields/Select";

type TableSearchType = "text" | "select";
type TableSearchQueryHandler = (query: string) => any;

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
