import * as React from 'react';

import Typography from '@material-ui/core/Typography';

import styles from './App.styles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import withRoot from './withRoot';

interface Props extends WithStyles<typeof styles> {}

class App extends React.Component<Props> {
  render() {
    return (
      <div className={this.props.classes.root}>
        <Typography variant="h4" gutterBottom>
          DOC-POC
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Document versioning project
        </Typography>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(App));
