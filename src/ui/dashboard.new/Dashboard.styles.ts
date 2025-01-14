import { makeStyles } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { NextTheme } from '../layout/theme-next/provider';
import Colors from '../layout/theme/utils/colors';

export const loadMoreStyles = (theme: NextTheme): CSSProperties => ({
  margin: theme.spacing(5, 1, 0.5),
});

export default makeStyles<NextTheme>(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  dashboard: {
    boxShadow: '0 0 25px rgba(41, 41, 41, 0.2)',
    borderRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: theme.spacing(1, 1, 0),
    background: Colors.white,
    margin: theme.spacing(-8, 4, 0),
    position: 'relative',
    zIndex: 1,
    flexGrow: 1,
    overflow: 'hidden',

    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(-8, 3, 0),
    },

    [theme.media.mobile]: {
      margin: theme.spacing(-7, 1.5, 0),
    },
  },
  wrapper: {
    width: '100%',
    height: '100%',
    margin: 'auto',
    overflow: 'hidden',
  },
  tabs: {
    height: '100%',
  },
  stats: {
    height: '100%',
    paddingTop: 56,
  },
  loadMore: loadMoreStyles(theme),
  searchContainer: {
    maxWidth: 500,
    marginTop: -78,
  },
  [theme.media.mobile]: {
    searchContainer: {
      display: 'none',
    },
    box: {
      margin: theme.spacing(0, 1.25),
    },
    stats: {
      display: 'none',
    },
  },
}));
