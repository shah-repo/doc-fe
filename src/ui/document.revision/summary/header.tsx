import {
  Chip,
  Grid,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { DataProps } from "../../../state/ducks/common";
import Text from "../../components/Text";
import styles from "./styles";

type Props = DataProps<DocumentRevision> & WithStyles<typeof styles>;

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
      <Grid item xs={3} alignItems="center">
        <Chip label={dataProp.status} className={classes.status} />
      </Grid>
      <Grid item xs={6} alignItems="center">
        <Typography variant="h6" align="center">
          <Text message="common.document" />
        </Typography>
      </Grid>
      <Grid item xs={3} alignItems="center">
        <Typography variant="h6" align="right" className={classes.crId}>
          {dataProp.document.docId}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(Header);
