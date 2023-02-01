import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { TableColumnProps } from "../../components/table/column/types";
import { TableSearchFieldProps } from "../../components/table/search/types";
import { TablePanelStateProps } from "../../components/table/types";
import { Translation } from "../../translations/types";

export const columnSearchConfiguration = (valuePath: string, tableCriteria: TablePanelStateProps): Partial<TableSearchFieldProps> => {
  let searchOptions: Partial<TableSearchFieldProps> = { dataKey: valuePath };
  if (valuePath.startsWith("precalc") || valuePath.startsWith("formInput")) {
    searchOptions.dataKey = `dynamicParams.${valuePath}`;
  }
  if (valuePath === "document.docId") {
    searchOptions.dataKey = "docId";
  }

  if (valuePath === "changeRequest.crId") {
    searchOptions.dataKey = "crId";
  }

  if (valuePath === "owner.user.name") {
    searchOptions.dataKey = "owner";
    searchOptions.ownerTemplate = true;

  }
  if (valuePath === "effectiveDate") {
    searchOptions = {
      dataKey: "effectiveDate",
      dateFilter: true,
    };
  }
  if (valuePath === "releasedAt") {
    searchOptions = {
      dataKey: "releasedAfter",
      dateFilter: true,
    };
  }

  searchOptions.defaultValue = tableCriteria.queryDict?.[searchOptions.dataKey as string];

  if (valuePath === "displayStatus" || valuePath === "status") {
    searchOptions.dataKey = "displayStatus";
    searchOptions.statusTemplate = true;
  }
  if (valuePath === "poStatus") {
    searchOptions.dataKey = "poStatus";
    searchOptions.poStatusTemplate = true;
  }
  return searchOptions;
};

export const getStaticColumns = (
  isByCategory,
  documentCategory,
  documentType,
): TableColumnProps<DocumentRevision>[] => [
  {
    key: "docId",
    label: `${isByCategory ? documentCategory : documentType?.documentTypeName} ID` as Translation,
    searchOptions: {
      dataKey: "document.docId",
    },
  },
  {
    key: "name",
    label: "document.title",
    searchOptions: {
    },
  },
  {
    key: "owner",
    label: "common.owner",
    searchOptions: {
      dataKey: "owner.user.name",
      ownerTemplate: true,
    },
  },
  {
    key: "status",
    label: "common.state",
    searchOptions: {
      dataKey: "displayStatus",
      statusTemplate: true,
    },
  },
  {
    key: "changeRequest",
    label: "common.approval.id",
    searchOptions: {
      dataKey: "changeRequest.crId",
    },
  },
];

