import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';
import UtilColors from '../../../../layout/theme/utils/colors';

export const styles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  expand: {
    fontSize: 18,
    marginRight: theme.spacing(2),
    color: Colors.textBlack,
  },
  headerCheckbox: {
    marginLeft: theme.spacing(1),
  },
  revsTableDateTimeLabel: {
    fontSize: 12,
    padding: theme.spacing(0, 1),
  },
  checkboxRowContent: {
    display: 'flex',
    alignItems: 'center',
  },
  checkboxRowContentDone: {
    color: Colors.success,
  },
  checkboxRowContentFailed: {
    color: Colors.error,
  },
  checkboxRowContentInProgress: {
    color: Colors.warning,
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  revsTableFlexBoxColumn: {
    display: 'flex',
    flexDirection: 'column',
    gridGap: theme.spacing(0.25, 1),
  },
  revsTablePrimaryText: {
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '21px',
    color: UtilColors.dark_jungle_green,
  },
  tableCellHiddenOverflow: {
    overflow: 'hidden',
    wordWrap: 'break-word',
  },
  cursorPointer: {
    cursor: 'pointer',
  },
}));
