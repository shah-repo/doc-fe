import { Grid, Typography } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import { SummaryBaseProps } from "./types";

type Props = SummaryBaseProps;

const Base: React.FunctionComponent<Props> = ({ label, value, noValueOption = "-", labelStyle, valueStyle }) => (
  <Grid item={true} xs={12}>
    <Grid container={true} spacing={1}>
      <Grid item={true} xs={12}>
        <Typography id="SummaryBaseProps-label" style={labelStyle}>
          {label && <Text message={label} />}
        </Typography>
      </Grid>
      <Grid item={true} xs={12}>
        {value ? (
          <Typography
            id="SummaryBaseProps-values"
            data-cy="SummaryBaseProps-values"
            style={valueStyle}
            variant="h5">
            {value}
          </Typography>
        ) : (
          <Typography id="SummaryBaseProps-noValues" style={valueStyle}>{noValueOption}</Typography>
        )}
      </Grid>
    </Grid>
  </Grid>
);

export default Base;
