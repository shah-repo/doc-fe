import { Button, Grid, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { stripTagsFromObject } from "../../../common/utils/helpers";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { CHANGE_REQUEST_ROOT_URL } from "../../../state/ducks/changeRequest/constants";
import { TableColumnProps } from "../../components/table/column/types";
import { DocumentInfo } from "../../components/table/DocumentInfo";
import { TablePanel } from "../../components/table/panel";
import Text from "../../components/Text";
import { CHANGE_REQUEST_CREATE_URL } from "../../constants/urls";
import { canEditChangeRequest, changeRequestStatusOption } from "../utils/helpers";
import { changeRequestEditPath, changeRequestPreviewPath } from "../utils/paths";
import { ChangeRequestsUserProps } from "../utils/types";
import styles from "./styles";

export type Props = ChangeRequestsUserProps & WithStyles<typeof styles>;

export const ListPresenter: React.FunctionComponent<Props> = ({
  classes,
  currentUserEmail,
  editChangeRequest,
  tableName,
  clearFilter,
  tableState,
}) => {

  const canEdit = (data: ChangeRequest) => canEditChangeRequest({dataProp: data, currentUserEmail});

  const cellHrefRenderer = (rowData: ChangeRequest): string => {
    if (canEdit(rowData)) {
      return changeRequestEditPath(rowData.id);
    }
    return changeRequestPreviewPath(rowData.id);
  };

  const columns: Array<TableColumnProps<ChangeRequest>> = [
    {
      key: "crId",
      label: "common.crid",
      cellHref: cellHrefRenderer,
      columnOptions: { width: 100 },
      searchOptions: {
        defaultValue: tableState.queryDict.crId,
      },
    },
    {
      key: "title",
      label: "cr.title",
      cellHref: cellHrefRenderer,
      columnOptions: { flexGrow: 2 },
      tooltipKey: "description",
      searchOptions: {
        defaultValue: tableState.queryDict.title,
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
        defaultValue: tableState.queryDict.owner,
      },
    },
    {
      key: "state",
      label: "common.status",
      columnOptions: { width: 80 },
      onSelect: ({rowData}) => () => editChangeRequest(rowData.id),
      cellType: (rowData: ChangeRequest) => (canEdit(rowData)) ? "LINK" : "BASE",
      searchOptions: {
        searchType: "select",
        selectOptions: changeRequestStatusOption(),
        defaultValue: tableState.queryDict.state,
      },
    },
  ];

  const customDataSet = (data: ChangeRequest[]) =>
    data.map((cr) => stripTagsFromObject(cr));

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={6}>
        <Button
          color="primary"
          variant="outlined"
          className={classes.clearButton}
          onClick={clearFilter}
        >
          <Text translation="common.clear.filters" />
        </Button>
        <DocumentInfo numberOfRecords={tableState.queryData.length} />
      </Grid>
      <Grid item={true} xs={6} style={{textAlign: "right"}}>
        <RouterLink to={CHANGE_REQUEST_CREATE_URL} className={classes.link}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
          >
            <Text translation="change.request.create" />
          </Button>
        </RouterLink>
      </Grid>
      <Grid item={true} className={classes.item}>
        <TablePanel<ChangeRequest>
          columns={columns}
          cellMeasure={true}
          queryUrl={CHANGE_REQUEST_ROOT_URL}
          customDataSet={customDataSet}
          tableName={tableName}
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ListPresenter);
