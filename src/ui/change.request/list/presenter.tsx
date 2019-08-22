import { Button, Grid, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { CHANGE_REQUEST_ROOT_URL } from "../../../state/ducks/changeRequest/constants";
import { TableColumnProps } from "../../components/table/column/types";
import { TablePanel } from "../../components/table/panel";
import { TableSelectionProps } from "../../components/table/types";
import Text from "../../components/Text";
import { CHANGE_REQUEST_CREATE_URL } from "../../constants/urls";
import { canEditChangeRequest, changeRequestStatusOption } from "../utils/helpers";
import { changeRequestEditPath, changeRequestPreviewPath } from "../utils/paths";
import { ChangeRequestsUserProps } from "../utils/types";
import styles from "./styles";

type Props = ChangeRequestsUserProps & WithStyles<typeof styles>;

const ListPresenter: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  currentUserEmail,
  editChangeRequest,
  previewChangeRequest,
}) => {

  const ChangeRequestList = TablePanel<ChangeRequest>();
  const [clearFilter, setClearFilter] = React.useState<boolean>(false);

  const canEdit = (data: ChangeRequest) => canEditChangeRequest({dataProp: data, currentUserEmail});

  const cellHrefRenderer = (rowData: ChangeRequest): string => {
    if (canEdit(rowData)) {
      return changeRequestEditPath(rowData.id);
    }
    return changeRequestPreviewPath(rowData.id);
  };

  const clear = () => setClearFilter(!clearFilter);

  const columns: Array<TableColumnProps<ChangeRequest>> = [
    {
      key: "crId",
      label: "common.crid",
      cellHref: cellHrefRenderer,
      columnOptions: { width: 100 },
    },
    {
      key: "title",
      label: "cr.title",
      cellHref: cellHrefRenderer,
      columnOptions: { flexGrow: 2 },
      tooltipKey: "description",
    },
    {
      key: "owner",
      label: "change.request.list.owner",
      cellHref: cellHrefRenderer,
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.owner.name,
        flexGrow: 1,
      },
    },
    {
      key: "state",
      label: "common.status",
      columnOptions: { width: 80 },
      onSelect: ({rowData}) => () => editChangeRequest(rowData.id),
      cellType: (rowData: ChangeRequest) => (canEdit(rowData)) ? "LINK" : "BASE",
      searchOptions: { searchType: "select", selectOptions: changeRequestStatusOption() },
    },
  ];

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={6}>
        <Button color="primary" className={classes.clearButton} onClick={clear} >
          Clear filters
        </Button>
      </Grid>
      <Grid item={true} xs={6} style={{textAlign: "right"}}>
        <RouterLink to={CHANGE_REQUEST_CREATE_URL} className={classes.link}>
          <Button variant="contained" color="primary" className={classes.button}>
            <Text translation="change.request.create" />
          </Button>
        </RouterLink>
      </Grid>
      <Grid item={true} className={classes.item}>
        <ChangeRequestList
          tableData={dataProp}
          columns={columns}
          cellMeasure={true}
          queryUrl={CHANGE_REQUEST_ROOT_URL}
          clearFilter={clear}
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ListPresenter);
