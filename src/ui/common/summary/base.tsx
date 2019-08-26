import { Grid, Typography } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import { SummaryBaseProps } from "./types";

type Props = SummaryBaseProps;

const Base: React.FunctionComponent<Props> = ({ label, value }) => (
  <Grid item xs={12}>
    <Grid item xs={12}>
      <Typography variant="subtitle1">{`${value}` || "—"}</Typography>
    </Grid>
  </Grid>
);

export default Base;
