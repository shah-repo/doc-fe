import { createStyles, makeStyles } from '@material-ui/core';

export default makeStyles((theme) => createStyles({
  // TODO remove separeate paddings and border after move to diviers on theme-next/overrides.ts after upgrading MUI
  content: ({ dividers }) => ({
    padding: dividers ? theme.spacing(3.25, 2.5) : undefined,
    borderBottom: 'none',
  }),
  title: {
    position: 'relative',
  },
  titleWithClose: {
    paddingRight: 60,
  },
  close: {
    position: 'absolute',
    right: theme.spacing(2.5),
    top: theme.spacing(1.75),
    zIndex: 2,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -1,
  },
  loadingAtTop: {
    bottom: 'auto',
    top: 0,
  },
}));
