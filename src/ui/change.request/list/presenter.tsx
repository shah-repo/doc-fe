import { Button, Grid, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { maskId, unmaskId } from "../../../state/ducks/common/helpers";
import { TableColumnProps } from "../../components/table/column/types";
import { TablePanel } from "../../components/table/panel";
import { TableSelectionProps } from "../../components/table/types";
import Text from "../../components/Text";
import { CHANGE_REQUEST_CREATE_URL } from "../../constants/urls";
import { canEditChangeRequest } from "../utils/helpers";
import { ChangeRequestsUserProps } from "../utils/types";
import styles from "./styles";

type Props = ChangeRequestsUserProps & WithStyles<typeof styles>;

const ListPresenter: React.FunctionComponent<Props> = ({
  classes,
  changeRequests,
  currentUserEmail,
  editChangeRequest,
  previewChangeRequest,
  loadChangeRequests,
}) => {

  const ChangeRequestList = TablePanel<ChangeRequest>();

  const stateCellTypeRenderer = (rowData: ChangeRequest) => {
    const changeRequest = rowData;
    const canEdit = canEditChangeRequest({changeRequest, currentUserEmail});
    return (canEdit) ? "LINK" : "BASE";
  };

  const onStateSelect = ({ rowData }: TableSelectionProps<ChangeRequest>) => () => {
    loadChangeRequests("/title=da");
    // return editChangeRequest(rowData.id);
  };

  const onRowSelect = ({rowData}: TableSelectionProps<ChangeRequest>) => () => {
    return previewChangeRequest(rowData.id);
  };

  const handleQuery = (query: string) => {
    alert(query);
  };

  const columns: Array<TableColumnProps<ChangeRequest>> = [
    {
      key: "ordinalNumber",
      label: "change.request.list.crId",
      columnOptions: {
        cellDataGetter: ({ rowData }) => `CR${maskId(rowData.ordinalNumber)}`,
        width: 100,
      },
      searchOptions : { searchValueGetter: (value) => unmaskId(value) },
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
      searchOptions: { searchType: "select", selectOptions: [{value: "1", text: "Text 1"}, {value: "2", text: "Text2"}] },
    },
  ];

  return (
    <Grid container={true} className={classes.root}>
      <Grid container={true} justify="flex-end">
        <RouterLink to={CHANGE_REQUEST_CREATE_URL} className={classes.link}>
          <Button variant="contained" color="primary" className={classes.button}>
            <Text translation="change.request.create" />
          </Button>
        </RouterLink>
      </Grid>
      <Grid item={true} className={classes.item}>
        <ChangeRequestList
          data={changeRequests}
          columns={columns}
          noRowsTranslation="change.request.list.noRows"
          cellMeasure={true}
          onSelect={onRowSelect}
          handleQuery={handleQuery}
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ListPresenter);
