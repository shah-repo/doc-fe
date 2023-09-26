import { FormControlLabel, Grid, Switch, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import HelpCenter from '../../App/Enlil/Features/HelpCenter/HelpCenter';
import { SearchBar } from '../../App/Enlil/Features/Search';
import { ReactComponent as MobileLogo } from '../../assets/images/enlil_white_logo.svg';
import Text from '../components/Text';
import AutosaveToggle from './autosave/autosave';
import styles from './Header.styles';

export interface HeaderPresenterProps {
  name: string
  fullHeight?: boolean
  toggleCustomLabels: () => void
  customLabelsValue: boolean
  canToggleCustomLabels: boolean
  open: boolean
}

const Header: React.FunctionComponent<HeaderPresenterProps & WithStyles<typeof styles>> = ({
  classes,
  name,
  fullHeight,
  toggleCustomLabels,
  customLabelsValue,
  canToggleCustomLabels,
}) => (
  <AppBar className={classes.appBar}>
    <Grid className={classes.mobileMake}> <MobileLogo />
      <Typography variant="caption" className={classes.TextMake} component="div">
        <Text translation="header.design.make" />
      </Typography>
    </Grid>
    <Toolbar className={classes.toolbar}>
      <Grid
        container
        alignItems="center"
        justify="space-between"
        wrap="nowrap"
        spacing={2}
      >

        <Grid item xs className={classes.MobileGrwFlex}>
          {!fullHeight && (
            <SearchBar />
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
            <FormControlLabel className={classes.MobileStyle}
              control={<Switch name="toggleCustomLabels" checked={customLabelsValue} onChange={toggleCustomLabels} />}
              label={<Text translation="form.builder.header.control.label" />}
            />
          )}
          <AutosaveToggle className={classes.MobileStyle} />
          <HelpCenter className={classes.MobileStyle} />
        </Grid>
      </Grid>
    </Toolbar>
  </AppBar>
);
export default withStyles(styles)(Header);
