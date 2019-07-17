import { Button, Grid, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { CHANGE_REQUEST_ROOT_URL } from "../../../state/ducks/changeRequest/constants";
import { maskId, unmaskId } from "../../../state/ducks/common/helpers";
import { TableColumnProps } from "../../components/table/column/types";
import { TablePanel } from "../../components/table/panel";
import { TableSelectionProps } from "../../components/table/types";
import Text from "../../components/Text";
import { CHANGE_REQUEST_CREATE_URL } from "../../constants/urls";
import { canEditChangeRequest, changeRequestStatusOption } from "../utils/helpers";
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

  const stateCellTypeRenderer = (rowData: ChangeRequest) => {
    const changeRequest = rowData;
    const canEdit = canEditChangeRequest({dataProp: changeRequest, currentUserEmail});
    return (canEdit) ? "LINK" : "BASE";
  };

  const onStateSelect = ({ rowData }: TableSelectionProps<ChangeRequest>) => () => {
    return editChangeRequest(rowData.id);
  };

  const onRowSelect = ({rowData}: TableSelectionProps<ChangeRequest>) => () => {
    return previewChangeRequest(rowData.id);
  };

  const clear = () => setClearFilter(!clearFilter);

  const columns: Array<TableColumnProps<ChangeRequest>> = [
    {
      key: "crId",
      label: "common.crid",
      searchOptions : { searchValueGetter: (value) => unmaskId(value) },
      columnOptions: {
        cellDataGetter: ({ rowData }) => `CR${maskId(rowData.ordinalNumber)}`,
        width: 100,
      },
    },
    {
      key: "description",
      label: "change.request.list.description",
      columnOptions: { flexGrow: 2 },
    },
    {
      key: "owner",
      label: "change.request.list.owner",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.owner.name,
        flexGrow: 1,
      },
    },
    {
      key: "state",
      label: "change.request.list.state",
      cellType: stateCellTypeRenderer,
      onSelect: onStateSelect,
      columnOptions: { width: 80 },
      searchOptions: { searchType: "select", selectOptions: changeRequestStatusOption() },
    },
  ];

  return (
    <Grid container={true} className={classes.root}>
      <Grid item={true} xs={6}>
        <Button color="secondary" className={classes.clearButton} onClick={clear} >
          Clear filters
        </Button>
      </Grid>
      <Grid container={true} xs={6} justify="flex-end">
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
          onSelect={onRowSelect}
          queryUrl={CHANGE_REQUEST_ROOT_URL}
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ListPresenter);
