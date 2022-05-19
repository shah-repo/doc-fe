import { Box, Grid, Typography, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import styles from "./newStyles";
import { SummaryBaseProps } from "./types";

type Props = SummaryBaseProps & WithStyles<typeof styles>;

const Base: React.FunctionComponent<Props> = ({ label, value, noValueOption = "-", classes }) => (
  <Grid item={true} xs={12}>
    <Box>
      <Typography id="SummaryBaseProps-values" data-cy="SummaryBaseProps-values" className={classes.title}
        variant="h5">
        {value ? value : noValueOption}
      </Typography>
    </Box>
  </Grid>
);

export default withStyles(styles)(Base);
