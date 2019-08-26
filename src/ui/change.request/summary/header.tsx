import {
  Chip,
  Grid,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import Text from "../../components/Text";
import styles from "./styles";

type Props = DataProps<ChangeRequest> & WithStyles<typeof styles>;

export const Header: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
}) => {
  return (
    <Grid
      container={true}
      alignItems="center"
      spacing={4}
      className={classes.headerContainer}
    >
      <Grid item xs={2} alignItems="center" />
      <Grid item xs={2} alignItems="center">
        <Chip label={dataProp.state} className={classes.status} />
      </Grid>
      <Grid item xs={3} alignItems="center">
        <Typography variant="h6" align="center">
          {dataProp.title}
        </Typography>
      </Grid>
      <Grid item xs={2} alignItems="center">
        <Typography variant="h6" align="right" className={classes.crId}>
          <Text translation="common.crid" />: {dataProp.crId}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Header);
