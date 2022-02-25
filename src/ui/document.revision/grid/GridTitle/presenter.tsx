import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import { Translation } from "../../../translations/types";
import { styles } from "./styles";

interface Props {
  translation?: Translation;
  title?: string;
}
const GridTitle: React.FunctionComponent<Props> = ({ translation, title = "" }) => {
  const classes = styles();
  const intl = useIntl();
  const gridTitle = translation ? intl.formatMessage({ id: translation }) : title;
  return (
    <Grid item xs alignItems="center" style={{ display: "flex" }}>
      <Typography className={classes.title}>{gridTitle}</Typography>
    </Grid>
  );
};

export default GridTitle;
