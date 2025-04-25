import { makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export default makeStyles(theme => ({
  announcementPopoverPaper: {
    padding: theme.spacing(1),
    maxWidth: 400,
    backgroundColor: Colors.medium_gray,
  },
  textContainer: {
    padding: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  announcementDetailRoot: {
    width: '100%',
    backgroundColor: Colors.medium_gray,
  },
  announcementDetailCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  announcementDetailTabIndicatorText: {
    color: Colors.font_gray,
    fontSize: 12,
  },
  announcementDetailTextDescription: {
    color: Colors.dark_gray,
    fontSize: 12,
    paddingTop: theme.spacing(1),
  },
  componentDisplayBox: {
    padding: theme.spacing(2),
  },
  conflictingElementsContainer: {
    backgroundColor: Colors.light_red,
    padding: theme.spacing(2),
  },
  announcementDetailOptionsArea: {
    padding: theme.spacing(2),
  },
  announcementDetailOptionsHeading: {
    marginLeft: theme.spacing(-1),
  },
  announcementDetailOptionsText: {
    color: Colors.gray,
    fontSize: 12,
  },
  announceDetailsAppBar: {
    position: 'relative',
    padding: theme.spacing(1, 2),
  },
  errorDiv: {
    color: Colors.red,
    backgroundColor: Colors.light_red,
    padding: theme.spacing(0.5),
  },
  infoDiv: {
    color: Colors.blue,
    backgroundColor: Colors.light_gray_blue,
    padding: theme.spacing(0.5, 1),
  },
  conflictingElementBox: {
    gap: theme.spacing(0.75),
  },
  upgradeSelectionFormControl: {
    width: 400,
    margin: theme.spacing(0.625),
  },
  infoText: {
    marginBottom: theme.spacing(2),
  },
  infoIndicatorPopoverPaper: {
    padding: theme.spacing(1),
    maxWidth: 400,
    backgroundColor: Colors.platinum_gray,
  },
  infoIndicatorWarningIcon: {
    color: Colors.error_red,
  },
  infoIndicatorIcon: {
    color: Colors.blue,
  },
  infoIndicatorWhite: {
    color: Colors.white,
  },
  infoIndicatorPopoverText: {
    marginTop: theme.spacing(0.5),
    fontSize: 12,
  },
  infoIndicatorWarningText: {
    color: Colors.latest_red_varient,
    marginTop: theme.spacing(0.5),
    fontSize: 12,
  },
  infoIcon: {
    fontSize: 16,
  },
  upgradeFormButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(1.25),
  },
  upgradeFormButton: {
    margin: theme.spacing(0, 0.625),
  },
}));
