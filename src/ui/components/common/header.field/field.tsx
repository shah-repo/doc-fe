import { AppBar, Box, Grid, Toolbar, Typography } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import React from "react";
import {
  DataProps,
  TypographyColor,
  TypographySize,
} from "../../../../state/ducks/common";
import { Translation } from "../../../translations/types";
import Text from "../../Text";
import { styles } from "./utils/styles";
import { HeaderFieldProps } from "./utils/types";

type Props = DataProps<Translation | string> & HeaderFieldProps;

const HeaderField: React.FunctionComponent<Props> = ({
  dataProp,
  size = "md",
  variant = "dense",
  color = "secondary",
  actionsRenderer,
}) => {
  const classes = styles({ variant, size });

  return (
    <Toolbar disableGutters={true} className={classes.toolbar}>
      <Typography
        variant={TypographySize[size]}
        color={TypographyColor[color]}
        gutterBottom={true}
        style={{ flex: 1 }}>
        <Text message={dataProp} />
      </Typography>
      {actionsRenderer && actionsRenderer()}
    </Toolbar>
  );
};

export default HeaderField;
