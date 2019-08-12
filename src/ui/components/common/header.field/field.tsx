import { AppBar, Box, Toolbar, Typography } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import React from "react";
import { DataProps } from "../../../../state/ducks/common";
import { Translation } from "../../../translations/types";
import Text from "../../Text";
import styles from "./utils/styles";
import { HeaderFieldProps, HeaderSize } from "./utils/types";

type Props = DataProps<Translation | string> & HeaderFieldProps & WithStyles<typeof styles>;

const HeaderField: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  size = "md",
  actionsRenderer,
}) => {

  return(
    <AppBar position="static" className={classes.root}>
      <Toolbar variant="dense" disableGutters={true} style={{minHeight: 30}} >
        <Typography variant={HeaderSize[size]} gutterBottom={true}>
          <Text message={dataProp} />
        </Typography>
        <Box style={{flexGrow: 1}} />
        {actionsRenderer && actionsRenderer()}
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(styles)(HeaderField);
