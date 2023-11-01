import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../ui/layout/theme-next';

const styles = makeStyles((theme) => ({
  createDocButton: {
    margin: 0,
    boxShadow: 'none',
    borderRadius: 100,
    textTransform: 'capitalize',
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    marginLeft: theme.spacing(1.875),
    background: Colors.primary,
    color: Colors.white,
    '&:hover': {
      background: Colors.primary,
    },
  },
  creteDocRouterLink: {
    textDecoration: 'none',
  },
}));

export default styles;
