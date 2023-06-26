import { makeStyles, Theme } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

const AddGroupStyles = makeStyles((theme: Theme) => ({
  Button: {
    'margin': 0,
    'boxShadow': 'none',
    'borderRadius': 100,
    'background': Colors.navy,
    'color': Colors.white,
    'paddingRight': theme.spacing(2.5),
    'paddingLeft': theme.spacing(2.5),
    'textTransform': 'none',
    '&:hover': {
      background: Colors.navy,
    },
  },
  historyButton: {
    'margin': '0 10px',
    'height': '36px',
    'borderRadius': 100,
    'background': Colors.light_blue,
    'color': Colors.navy,
    'fontSize': '12px',
    'justifyContent': 'center',
    'alignItems': 'center',
    'textTransform': 'none',
    '&:hover': {
      background: Colors.light_blue,
    },
  },
}));

export default AddGroupStyles;
