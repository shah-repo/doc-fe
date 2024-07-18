import { makeStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export default makeStyles((theme) => ({
  root: {
    margin: 0,
    '&:hover': {
      backgroundColor: 'unset',
    },
    '&:disabled': {
      opacity: 0.5,
    },
  },
  label: {
    padding: theme.spacing(1.31, 2.5),
    fontFamily: 'Sora',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 12,
    lineHeight: '15px',
    backgroundColor: Colors.white,
    color: Colors.navy,
    borderRadius: 100,
    minWidth: 72,
  },
}));
