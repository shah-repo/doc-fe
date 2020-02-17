import {
  Box,
  Chip,
  Grid,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { getFormattedStartOfDayDateString } from "../../../common/utils/date";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import Text from "../../components/Text";
import styles from "./styles";

export type Props = DataProps<ChangeRequest> & WithStyles<typeof styles>;

export const Header: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  dataProp: { state, closedAt },
}) => {

  const status = (
    <Box>
      {state}
      {closedAt && <Text message={`, ${getFormattedStartOfDayDateString(closedAt)}`} />}
    </Box>
  );

  return (
    <Grid
      container={true}
      alignItems="center"
      spacing={4}
      className={classes.headerContainer}
    >
      <Grid item={true} xs={3}>
        <Chip label={status} className={classes.status} />
      </Grid>
      <Grid item={true} xs={6}>
        <Typography variant="h6" align="center">
          {dataProp.title}
        </Typography>
      </Grid>
      <Grid item={true} xs={3}>
        <Typography variant="h6" align="right" className={classes.crId}>
          <Text translation="common.crid" />: {dataProp.crId}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Header);
