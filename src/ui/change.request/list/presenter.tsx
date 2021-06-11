import { Grid } from "@material-ui/core";
import React, { useCallback } from "react";
import { convertHtmlEntities, stripTags, stripTagsFromObject } from "../../../common/utils/helpers";
import { CHANGE_REQUEST_ROOT_URL } from "../../../state/ducks/changeRequest/constants";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import ClearFilters from "../../components/table/ClearFilters";
import { TableColumnProps } from "../../components/table/column/types";
import { DocumentInfo } from "../../components/table/DocumentInfo";
import { TablePanel } from "../../components/table/panel";
import FromListContainer from "../form.list/FormList.container";
import { canEditChangeRequest, changeRequestStatusOption } from "../utils/helpers";
import { changeRequestEditPath, changeRequestPreviewPath } from "../utils/paths";
import { ChangeRequestsUserProps } from "../utils/types";
import { styles } from "./styles";

type Props = ChangeRequestsUserProps;

const ListPresenter: React.FunctionComponent<Props> = ({
  currentUserEmail,
  editChangeRequest,
  tableName,
  clearFilter,
  tableCriteria,
  tableData,
}) => {
  const classes = styles();
  const canEdit = (data: ChangeRequest) =>
    canEditChangeRequest({ dataProp: data, currentUserEmail });

  const textEditorTooltipRenderer = (rowData: ChangeRequest) =>
    convertHtmlEntities(stripTags(rowData.description || ""));

  const cellHrefRenderer = (rowData: ChangeRequest): string => {
    if (canEdit(rowData)) {
      return changeRequestEditPath(rowData.id);
    }
    return changeRequestPreviewPath(rowData.id);
  };

  const columns: TableColumnProps<ChangeRequest>[] = [
    {
      key: "crId",
      label: "common.crid",
      cellHref: cellHrefRenderer,
      columnOptions: { width: 100 },
      sortable: true,
      searchOptions: {
        defaultValue: tableCriteria.queryDict?.crId,
      },
    },
    {
      key: "title",
      label: "cr.title",
      cellHref: cellHrefRenderer,
      columnOptions: { flexGrow: 2 },
      tooltipKey: textEditorTooltipRenderer,
      searchOptions: {
        defaultValue: tableCriteria.queryDict?.title,
      },
    },
    {
      key: "owner",
      label: "change.request.list.owner",
      cellHref: cellHrefRenderer,
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.owner.user.name,
        flexGrow: 1,
      },
      searchOptions: {
        defaultValue: tableCriteria.queryDict?.owner,
      },
    },
    {
      key: "state",
      label: "common.status",
      columnOptions: { width: 80 },
      onSelect: ({ rowData }) => () => editChangeRequest(rowData.id),
      cellType: (rowData: ChangeRequest) =>
        canEdit(rowData) ? "LINK" : "BASE",
      searchOptions: {
        searchType: "select",
        selectOptions: changeRequestStatusOption(),
        defaultValue: tableCriteria.queryDict?.state,
      },
    },
  ];

  const headers = [
    { label: `AR ID: ${tableCriteria.queryDict?.crId  || ""}`, key: "crId" },
    { label: `AR TITLE: ${tableCriteria.queryDict?.title  || ""}`, key: "title" },
    { label: `OWNER: ${tableCriteria.queryDict?.owner  || ""}`, key: "owner" },
    { label: `STATUS: ${tableCriteria.queryDict?.state || ""}`, key: "state" },
  ];

  const customDataSet = useCallback((data: ChangeRequest[]) =>
    data.map((cr) => stripTagsFromObject(cr)
  ), []) 

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={6}>
        <ClearFilters {...{ clearFilter }}/>
        <DocumentInfo numberOfRecords={tableData.length} />
      </Grid>
      <FromListContainer {...{ headers, tableData }}/>
      <Grid item={true} className={classes.item}>
        <TablePanel<ChangeRequest>
          columns={columns}
          cellMeasure={true}
          queryUrl={CHANGE_REQUEST_ROOT_URL}
          customDataSet={customDataSet}
          tableName={tableName}
          sortBy={"crId"}
        />
      </Grid>
    </Grid>
  );
};

export default ListPresenter
