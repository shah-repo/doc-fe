import { Grid, Typography, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import styles from "./newStyles";
import { SummaryBaseProps } from "./types";

type Props = SummaryBaseProps & WithStyles<typeof styles>;

const Base: React.FunctionComponent<Props> = ({ label, value, noValueOption = "-", classes }) => (
  <Grid item={true} xs={12}>
    <Typography id="field-name" data-cy="field-name" className={classes.title} variant="h5">
      {value ? value : noValueOption}
    </Typography>
  </Grid>
);

export default withStyles(styles)(Base);
