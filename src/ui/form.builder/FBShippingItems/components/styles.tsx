import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export const styles = makeStyles((theme) => ({
  option: {
    fontSize: '14px',
    fontFamily: 'Sora',
    overflowWrap: 'anywhere',
  },
  link: {
    color: `${Colors.primaryDark} !important`,
    cursor: 'Pointer',
    overflow: 'hidden',
    textDecoration: 'initial !important',
    '&:hover': {
      textDecoration: 'underline !important',
    },
  },
}));
