import { Grid, ListItem, Typography } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import { SummaryBaseProps } from "./types";

type Props = SummaryBaseProps;

const Base: React.FunctionComponent<Props> = ({
  label,
  value,
}) => (
  <ListItem>
    <Grid item={true} xs={4}>
      <Typography variant="body1"><Text message={label} />:</Typography>
    </Grid>
    <Grid item={true} xs={8}>
      <Typography variant="subtitle1">{`${value}` || "—"}</Typography>
    </Grid>
  </ListItem>
);

export default Base;
