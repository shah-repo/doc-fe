import { AppBar, Box, Toolbar, Typography } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import React from "react";
import { DataProps } from "../../../../state/ducks/common";
import { Translation } from "../../../translations/types";
import Text from "../../Text";
import styles from "./utils/styles";
import { HeaderFieldProps } from "./utils/types";

type Props = DataProps<Translation> & HeaderFieldProps & WithStyles<typeof styles>;

const HeaderField: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  actionsRenderer,
}) => {

  return(
    <AppBar position="static" className={classes.root} >
      <Toolbar variant="dense" disableGutters={true} style={{minHeight: 30, height: 30}} >
        <Typography variant="h5" gutterBottom={true}>
          <Text translation={dataProp} />
        </Typography>
        <Box style={{flexGrow: 1}} />
        {actionsRenderer && actionsRenderer()}
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(styles)(HeaderField);
