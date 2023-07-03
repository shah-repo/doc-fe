import { FormControlLabel, Grid, Switch, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import React from 'react';
import HelpCenter from '../../App/Enlil/Features/HelpCenter/HelpCenter';
import Search from '../../App/Enlil/Features/Search/Search';
import Text from '../components/Text';
import styles from './Header.styles';
import AutosaveToggle from './autosave/autosave';

export interface HeaderPresenterProps {
  name: string
  fullHeight?: boolean
  isSearchEnabled?: boolean
  toggleCustomLabels: () => void
  customLabelsValue: boolean
  canToggleCustomLabels: boolean
}

const Header: React.FunctionComponent<HeaderPresenterProps & WithStyles<typeof styles>> = ({
  classes,
  name,
  fullHeight,
  isSearchEnabled,
  toggleCustomLabels,
  customLabelsValue,
  canToggleCustomLabels,
}) => (
  <AppBar className={classes.appBar}>
    <Toolbar className={classes.toolbar}>
      <Grid
        container
        alignItems="center"
        justify="space-between"
        wrap="nowrap"
        spacing={2}
      >
        <Grid item xs>
          {isSearchEnabled && (
            <Search />
          )}
        </Grid>
        <Grid item>
          {fullHeight && (
            <Typography variant="caption" className={classes.welcomeText} component="div">
              <Text translation="header.welcome.back" />,
              {' '}
              <b className={classes.welcomeTextName}>{name}!</b>
            </Typography>
          )}
          {canToggleCustomLabels && (
            <FormControlLabel
              control={<Switch name="toggleCustomLabels" checked={customLabelsValue} onChange={toggleCustomLabels} />}
              label={<Text translation="form.builder.header.control.label" />}
            />
          )}
          <AutosaveToggle />
          <HelpCenter />
        </Grid>
      </Grid>
    </Toolbar>
  </AppBar>
);
export default withStyles(styles)(Header);
