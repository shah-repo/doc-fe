import { makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme-next/colors';

export default makeStyles(theme => ({
  announcementPopoverPaper: {
    padding: theme.spacing(1),
    maxWidth: 400,
    color: Colors.textBlack,
    backgroundColor: Colors.primaryBg,
    border: `1px solid ${Colors.tableStroke}`,
  },
  textContainer: {
    padding: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  announcementDetailRoot: {
    width: '100%',
    color: Colors.textBlack,
    backgroundColor: Colors.primaryBg,
    border: `1px solid ${Colors.tableStroke}`,
  },
  announcementDetailCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  announcementDetailTabIndicatorText: {
    color: Colors.textBlack,
    fontSize: 12,
  },
  announcementDetailTextDescription: {
    color: Colors.textBlack,
    fontSize: 12,
    paddingTop: theme.spacing(1),
  },
  componentDisplayBox: {
    padding: theme.spacing(2),
  },
  conflictingElementsContainer: {
    backgroundColor: Colors.errorHighlight,
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
    color: Colors.error,
    backgroundColor: Colors.errorHighlight,
    padding: theme.spacing(0.5),
  },
  infoDiv: {
    color: Colors.primaryLight,
    backgroundColor: Colors.primaryHighlight,
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
    color: Colors.textBlack,
    backgroundColor: Colors.primaryHighlight,
  },
  infoIndicatorWarningIcon: {
    color: Colors.error,
  },
  infoIndicatorIcon: {
    color: Colors.primary,
  },
  infoIndicatorWhite: {
    color: Colors.white,
  },
  infoIndicatorPopoverText: {
    marginTop: theme.spacing(0.5),
    fontSize: 12,
  },
  infoIndicatorWarningText: {
    color: Colors.error,
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
  infoIndicatorPopover: {
    pointerEvents: 'none',
  },
  popoverContent: {
    padding: theme.spacing(1),
  },
  popoverContainer: {
    display: 'inline',
  },
}));
