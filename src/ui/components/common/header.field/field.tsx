import { AppBar, Box, Toolbar, Typography } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import React from "react";
import { DataProps, TypographySize } from "../../../../state/ducks/common";
import { Translation } from "../../../translations/types";
import Text from "../../Text";
import { styles } from "./utils/styles";
import { HeaderFieldProps } from "./utils/types";

type Props = DataProps<Translation | string> & HeaderFieldProps;

const HeaderField: React.FunctionComponent<Props> = ({
  dataProp,
  size = "md",
  variant = "dense",
  actionsRenderer,
}) => {

  const classes = styles({ variant, size });

  return(
      <AppBar position="static">
      <Toolbar disableGutters={true} className={classes.toolbar}>
        <Typography variant={TypographySize[size]} gutterBottom={true}>
          <Text message={dataProp} />
        </Typography>
        <Box p={0} style={{flexGrow: 1}} />
        {actionsRenderer && actionsRenderer()}
      </Toolbar>
    </AppBar>
  );
};

export default HeaderField;
