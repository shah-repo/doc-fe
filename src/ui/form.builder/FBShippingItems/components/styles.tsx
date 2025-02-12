import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles((theme) => ({
  option: {
    fontSize: 14,
    overflowWrap: 'anywhere',
  },
  link: {
    color: `${Colors.primaryDark} !important`,
    cursor: 'pointer',
    overflow: 'hidden',
    textDecoration: 'initial !important',
    '&:hover': {
      textDecoration: 'underline !important',
    },
  },
}));
