import {
    withStyles,
    WithStyles,
  } from "@material-ui/core";
import * as React from "react";
import styles from "./SupplierSurvey.styles";

interface Props extends WithStyles<typeof styles> {
    token: string;
  }
const SupplierSurveyPresenter: React.FunctionComponent<Props> = ({ classes }) => (
    <div className={classes.root}>
      "Supplier Survey"
    </div>
  );

export default withStyles(styles)(SupplierSurveyPresenter);
