import { Typography, WithStyles, withStyles } from "@material-ui/core";
import * as React from "react";
import styles from "./App.styles";

interface IProps extends WithStyles<typeof styles> {}

class App extends React.Component<IProps> {
  public render() {
    return (
      <div className={this.props.classes.root}>
        <Typography variant="h4" gutterBottom={true}>
          DOC-POC
        </Typography>
        <Typography variant="subtitle1" gutterBottom={true}>
          Document versioning project
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(App);
