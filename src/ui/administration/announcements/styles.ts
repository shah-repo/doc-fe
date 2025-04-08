import { makeStyles } from '@material-ui/core';
import { NextTheme } from '../../layout/theme-next/provider';
import Colors from '../../layout/theme/utils/colors';

export default makeStyles<NextTheme>(theme => ({
  announcementPopoverPaper: {
    padding: theme.spacing(1),
    maxWidth: '400px',
    backgroundColor: Colors.medium_gray,
  },
  popoverText: {
    marginTop: '4px',
    marginBottom: '4px',
  },
  announcementDetailRoot: {
    width: '100%',
    backgroundColor: Colors.medium_gray,
  },
  announcementDetailCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  announcementDetailTabIndicatorText: {
    color: Colors.font_gray,
    fontSize: '12px',
  },
  announcementDetailTextDescription: {
    color: Colors.dark_gray,
    fontSize: '13px',
    paddingTop: '0',
  },
  componentDisplayBox: {
    padding: theme.spacing(2),
  },
  conflictingElementsContainer: {
    backgroundColor: Colors.light_red,
    padding: '16px',
  },
  announcementDetailOptionsArea: {
    padding: '16px',
  },
  announcementDetailOptionsHeading: {
    marginLeft: '-8px',
  },
  announcementDetailOptionsText: {
    color: Colors.dark_gray,
    fontSize: '13px',
  },
  announceDetailsAppBar: {
    position: 'relative',
    padding: '8px 16px',
  },
  errorDiv: {
    color: Colors.red,
    backgroundColor: Colors.light_red,
    padding: '4px',
  },
  infoDiv: {
    color: Colors.blue,
    backgroundColor: Colors.light_gray_blue,
    padding: '4px 8px',
  },
  conflictingElementBox: {
    gap: '6px',
  },
  upgradeSelectionFormControl: {
    width: '400px',
  },
  infoText: {
    marginBottom: '1em',
  },
  infoIndicatorPopoverPaper: {
    padding: theme.spacing(1),
    maxWidth: '400px',
    backgroundColor: Colors.platinum_gray,
  },
  infoIndicatorWarningIcon: {
    color: Colors.error_red,
  },
  infoIndicatorPopoverText: {
    marginTop: '4px',
    fontSize: 'small',
  },
  infoIndicatorWarningText: {
    color: Colors.latest_red_varient,
    marginTop: '4px',
    fontSize: 'small',
  },
}));
