import { Grid, Typography } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import { SummaryBaseProps } from "./types";

type Props = SummaryBaseProps;

const Base: React.FunctionComponent<Props> = ({ label, value, noValueOption = "-" }) => (
  <Grid item={true} xs={12}>
    <Grid container={true} spacing={1}>
      <Grid item={true} xs={12}>
        <Typography variant="h6" id="SummaryBaseProps-label">
          {label && <Text message={label} />}
        </Typography>
      </Grid>
      <Grid item={true} xs={12}>
        {value && <Typography id="SummaryBaseProps-values" data-cy="SummaryBaseProps-values" variant="h5">{value}</Typography>}
        {!value && <Typography id="SummaryBaseProps-noValues" variant="h5">{noValueOption}</Typography>}
      </Grid>
    </Grid>
  </Grid>
);

export default Base;
