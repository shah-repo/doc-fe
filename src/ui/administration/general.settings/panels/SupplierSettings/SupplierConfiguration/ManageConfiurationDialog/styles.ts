import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  paper: {
    width: '720px',
  },
  tabs: {
    flexGrow: 1,
    overflow: 'auto',
    marginTop: theme.spacing(2.5),
  },
  tab: {
    fontFamily: 'Sora',
    fontWeight: 600,
    fontSize: 12,
    lineHeight: '100%',
    letterSpacing: '0px',
    textTransform: 'uppercase',
    minWidth: 'fit-content',
    '&:first-child': {
      marginLeft: 0,
    },
  },
}));
