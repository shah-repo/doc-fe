import {
    withStyles,
    WithStyles,
  } from "@material-ui/core";
import * as React from "react";
import styles from "./SwitchCompanyPresenter.styles";

type Props = WithStyles<typeof styles>;

const SwitchCompanyPresenter: React.FunctionComponent<Props> = ({ classes }) => (
    <div className={classes.root}>
        <div className={classes.container}>
            <div className={classes.title}>Switch Company</div>
            <div className={classes.subtitle}>Select a company below to sign-in to</div>
        </div>
    </div>
  );

export default withStyles(styles)(SwitchCompanyPresenter);
