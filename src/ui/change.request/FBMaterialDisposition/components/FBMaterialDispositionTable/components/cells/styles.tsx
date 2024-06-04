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
  actionLabel: {
    width: '90%',
  },
  copyIcon: {
    width: 15,
    height: 15,
    verticalAlign: 'baseline',
    cursor: 'pointer',
  },
  selectedDot: {
    color: Colors.almost_black,
  },
  deselectedDot: {
    color: Colors.dark_gray2,
  },
  poPreviewDot: {
    marginLeft: theme.spacing(1.875),
    marginRight: theme.spacing(0.625),
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
  optionWrap: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  paper: {
    width: '238px',
  },
  nonEnlilDocInfoIcon: {
    height: 14,
    width: 14,
    cursor: 'pointer',
    marginLeft: theme.spacing(0.625),
  },
}));
