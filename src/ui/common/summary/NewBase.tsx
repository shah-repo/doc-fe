import { Box, Grid } from "@material-ui/core";
import React from "react";
import { SummaryBaseProps } from "./types";

type Props = SummaryBaseProps;

const Base: React.FunctionComponent<Props> = ({ label, value, noValueOption = "-" }) => (
  <Grid item={true} xs={12}>
    <Grid container={true} spacing={1}>
      {/* <Grid item={true} xs={12}>
        <Typography variant="h6" id="SummaryBaseProps-label">
          {label && <Text message={label} />}
        </Typography>
      </Grid> */}
      <Grid item={true} xs={12}>
        <Box style={{
          fontFamily: "Sora",
          fontStyle: "normal",
          fontWeight: 600,
          fontSize: "19px",
          lineHeight: "24px",
          left: "4px",
          top: "40px",
        }}>
          {/* {value && <Typography
            id="SummaryBaseProps-values"
            data-cy="SummaryBaseProps-values"
            variant="h5">
            {value}
          </Typography>} */}
          <Box>
            {value ?  value :  noValueOption }
          </Box>
          {/* {!value && <Typography id="SummaryBaseProps-noValues" variant="h5">{noValueOption}</Typography>} */}
        </Box>
      </Grid>
    </Grid>
  </Grid>
);

export default Base;
