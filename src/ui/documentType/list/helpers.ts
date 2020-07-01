import { isString } from "lodash";
import { GroupTag } from "../../../state/ducks/auth/types";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { TableSearchFieldProps } from "../../components/table/search/types";
import { TablePanelStateProps } from "../../components/table/types";
import { documentRevisionStatusOption } from "../../document.revision/utils/helpers";

export const shouldShowStaticColumns = (documentTypeName) => documentTypeName !== "Purchase Order";

export const columnSearchConfiguration = (valuePath: string, tableCriteria: TablePanelStateProps): [boolean, Partial<TableSearchFieldProps>] => {
  let omitSearch = true;
  const searchOptions: Partial<TableSearchFieldProps> = { dataKey: valuePath };
  if (valuePath.startsWith("precalc") || valuePath.startsWith("formInput")) {
    omitSearch = false;
    searchOptions.dataKey = `dynamicParams.${valuePath}`;
  }
  if (valuePath === "document.docId") {
    omitSearch = false;
    searchOptions.dataKey = "docId";
  }
  if (valuePath === "owner.user.name") {
    omitSearch = false;
    searchOptions.dataKey = "owner";
  }
  searchOptions.defaultValue = tableCriteria.queryDict[searchOptions.dataKey as string];

  if (valuePath === "status") {
    omitSearch = false;
    searchOptions.dataKey = "status[]";
    searchOptions.searchType = "select";
    searchOptions.selectOptions = documentRevisionStatusOption();
    searchOptions.defaultValue = isString(tableCriteria.queryDict["status[]"])
      ? tableCriteria.queryDict["status[]"]
      : undefined;
  }

  return [omitSearch, searchOptions];
};


export const filterSecurityGroupsForQms = (isQms = false, groupOptions) => {
  if (!isQms) {
    return [];
  }
  return groupOptions.reduce((acc, group) => {
    if (group.tags?.includes(GroupTag.QMS_DEFAULT)) {
      acc.push({ value: group.value, label: group.label });
    }
    return acc;
  }, [] as OptionType[]);
};
