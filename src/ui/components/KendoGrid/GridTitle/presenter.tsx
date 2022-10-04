import { Box, Typography } from "@material-ui/core";
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
    <Box>
      <Typography data-cy="gridTitle" className={classes.title}>{gridTitle}</Typography>
    </Box>
  );
};

export default GridTitle;
