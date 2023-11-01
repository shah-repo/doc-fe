import { makeStyles } from '@material-ui/core';
import Colors from '../../../../../../layout/theme/utils/colors';

export const styles = makeStyles((theme) => ({
  contentCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    width: 10,
  },
  selectedDot: {
    color: Colors.almost_black,
  },
  deselectedDot: {
    color: Colors.dark_gray2,
  },
  poPreviewDot: {
    marginLeft: theme.spacing(1.875),
    verticalAlign: 'baseline',
    cursor: 'pointer',
  },
  poPreviewModal: {
    color: `${Colors.navy_active} !important`,
    width: 343,
  },
  poPreviewModalItem: {
    '&:first-child': {
      marginBottom: theme.spacing(1.875),
    },
  },
  link: {
    color: `${Colors.navy_active} !important`,
    cursor: 'Pointer',
    textDecoration: 'initial !important',
    '&:hover': {
      textDecoration: 'underline !important',
    },
  },
}));
