import { Grid, ListItem, Typography } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import { SummaryBaseProps } from "./types";
import { getInnerHTMLProp } from "../../../common/utils/helpers";

type Props = SummaryBaseProps;

const BaseWithhtml: React.FunctionComponent<Props> = ({
  label,
  value,
}) => (
  <ListItem>
    <Grid item={true} xs={4}>
      <Typography variant="body1"><Text message={label} />:</Typography>
    </Grid>
    <Grid item={true} xs={8}>
      <Typography dangerouslySetInnerHTML={getInnerHTMLProp(value)} variant="subtitle1" />
    </Grid>
  </ListItem>
);

export default BaseWithhtml;
