import { isString } from "lodash";
import { GroupTag } from "../../../state/ducks/auth/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { TableColumnProps } from "../../components/table/column/types";
import { TableSearchFieldProps } from "../../components/table/search/types";
import { TablePanelStateProps } from "../../components/table/types";
import { documentRevisionEffectiveDateOption, documentRevisionStatusOption } from "../../document.revision/utils/helpers";
import { Translation } from "../../translations/types";

export const shouldShowStaticColumns = (documentTypeName) => documentTypeName !== "Purchase Order";

export const columnSearchConfiguration = (valuePath: string, tableCriteria: TablePanelStateProps): [boolean, Partial<TableSearchFieldProps>] => {
  let omitSearch = true;
  let searchOptions: Partial<TableSearchFieldProps> = { dataKey: valuePath };
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
  if (valuePath === "effectiveDate") {
    omitSearch = false;
    searchOptions = {
      dataKey: "effectiveDate",
      searchType: "select",
      selectOptions: documentRevisionEffectiveDateOption(),
      defaultValue: tableCriteria.queryDict.effectiveDate,
    };
  }
  if (valuePath === "name") {
    omitSearch = false;
  }
  searchOptions.defaultValue = tableCriteria.queryDict?.[searchOptions.dataKey as string];

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

export const getStaticColumns = (
  isByCategory,
  documentCategory,
  documentType,
  cellHrefRenderer,
  tableCriteria,
  canEdit,
): TableColumnProps<DocumentRevision>[] => [
  {
    key: "docId",
    label: `${isByCategory ? documentCategory : documentType?.documentTypeName} ID` as Translation,
    cellHref: cellHrefRenderer,
    sortable: true,
    columnOptions: {
      cellDataGetter: ({ rowData }) => rowData.document.docId,
      width: 150,
    },
    searchOptions: {
      defaultValue: tableCriteria.queryDict?.docId,
    },
  },
  {
    key: "name",
    label: "document.title",
    tooltipKey: "name",
    cellHref: cellHrefRenderer,
    searchOptions: {
      defaultValue: tableCriteria.queryDict?.name,
    },
  },
  {
    key: "owner",
    label: "common.owner",
    cellHref: cellHrefRenderer,
    columnOptions: {
      cellDataGetter: ({ rowData }) => rowData.owner.user.name,
    },
    searchOptions: {
      defaultValue: tableCriteria.queryDict?.owner,
    },
  },
  {
    key: "status",
    label: "common.state",
    columnOptions: { width: 160 },
    cellType: (rowData) => (canEdit(rowData) ? "LINK" : "BASE"),
    searchOptions: {
      dataKey: "status[]",
      defaultValue: isString(tableCriteria.queryDict?.["status[]"])
        ? tableCriteria.queryDict?.["status[]"]
        : undefined,
      searchType: "select",
      selectOptions: documentRevisionStatusOption(),
    },
  },
  {
    key: "changeRequest",
    label: "common.approval.id",
    searchOptions: {
      dataKey: "crId",
      defaultValue: tableCriteria.queryDict?.crId,
    },
    cellHref: cellHrefRenderer,
    columnOptions: {
      cellDataGetter: ({ rowData }) =>
        rowData.changeRequest && rowData.changeRequest.crId,
      width: 100,
    },
  },
];
