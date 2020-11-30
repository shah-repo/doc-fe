import { GroupTag } from "../../../state/ducks/auth/types";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { TableColumnProps } from "../../components/table/column/types";
import { TableSearchFieldProps } from "../../components/table/search/types";
import { TablePanelStateProps } from "../../components/table/types";
import { documentRevisionEffectiveDateOption, documentRevisionStatusOption } from "../../document.revision/utils/helpers";
import { Translation } from "../../translations/types";

export const shouldShowStaticColumns = (documentTypeName) => documentTypeName !== "Purchase Order";

export const columnSearchConfiguration = (valuePath: string, tableCriteria: TablePanelStateProps, statuses: DocumentRevisionStatus[]): [boolean, Partial<TableSearchFieldProps>] => {
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

  if (valuePath === "changeRequest.crId") {
    omitSearch = false;
    searchOptions.dataKey = "crId";
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
  if (valuePath === "releasedAt") {
    omitSearch = false;
    searchOptions = {
      dataKey: "releasedAfter",
      searchType: "select",
      selectOptions: documentRevisionEffectiveDateOption(),
      defaultValue: tableCriteria.queryDict?.releasedAfter,
    };
  }
  if (valuePath === "name") {
    omitSearch = false;
  }
  searchOptions.defaultValue = tableCriteria.queryDict?.[searchOptions.dataKey as string];

  if (valuePath === "displayStatus" || valuePath === "status") {
    omitSearch = false;
    searchOptions.dataKey = "displayStatus";
    searchOptions.searchType = "select";
    searchOptions.selectOptions = documentRevisionStatusOption(statuses);
    searchOptions.defaultValue = tableCriteria.queryDict?.displayStatus;
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
  statuses,
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
    columnOptions: {
      cellDataGetter: ({ rowData }) => (rowData.displayStatus).toUpperCase(),
      width: 160,
    },
    cellType: (rowData) => (canEdit(rowData) ? "LINK" : "BASE"),
    searchOptions: {
      dataKey: "displayStatus",
      defaultValue: tableCriteria.queryDict?.displayStatus,
      searchType: "select",
      selectOptions: documentRevisionStatusOption(statuses),
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
