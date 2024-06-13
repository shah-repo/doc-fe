import { makeStyles } from '@material-ui/core';
import Colors from '../../../../layout/theme/utils/colors';

export const styles = makeStyles((theme) => ({
  contentCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  option: {
    fontSize: '14px',
    fontFamily: 'Sora',
    overflowWrap: 'anywhere',
  },
  dot: {
    height: 10,
    width: 10,
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
  stepCellContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  step: {
    width: '30%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  seperator: {
    margin: theme.spacing(0, 1),
  },
  mpi: {
    width: '60%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));
