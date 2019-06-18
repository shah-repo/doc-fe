import { Button, Grid, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ChangeRequest } from "../../state/ducks/changeRequest";
import { TableColumnProps } from "../components/table/columns/types";
import { TablePanel } from "../components/table/TablePanel";
import Text from "../components/Text";
import { CHANGE_REQUEST_CREATE_URL } from "../constants/urls";
import styles from "./List.styles";
import { ChangeRequestUserProps } from "./utils/types";

type Props = ChangeRequestUserProps & WithStyles<typeof styles>;

const ListPresenter: React.FunctionComponent<Props> = ({
  classes,
  changeRequests,
  currentUserEmail,
  previewChangeRequest,
}) => {

  const ChangeRequestList = TablePanel<ChangeRequest>();

  const columns: Array<TableColumnProps<ChangeRequest>> = [
    {
      key: "crId",
      label: "change.request.list.crId",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.type,
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
      columnOptions: { width: 80 },
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
      />
    </Grid>
  </Grid>
  );
};

export default withStyles(styles)(ListPresenter);
