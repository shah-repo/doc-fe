import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../../../layout/theme/utils/colors';

export default makeStyles((theme) => createStyles({
  container: {
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),
    maxWidth: 550,
    width: '100%',
    height: 250,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
  },
  dropzone: {
    border: `2px dashed ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    textAlign: 'center',
    cursor: 'pointer',
    color: theme.palette.text.secondary,
    height: '100%',
    display: 'grid',
  },
  textContainer: {
    alignSelf: 'center',
  },
  text: {
    '& span': {
      display: 'block',
      fontWeight: '400',
      fontSize: 14,
      fontFamily: 'Sora',
    },
  },
  plus: {
    fontSize: '24px',
    lineHeight: '24px',
  },
  browseText: {
    color: Colors.navy,
  },
  icon: {
    height: 21,
    width: 21,
    marginBottom: theme.spacing(1),
  },
}));
