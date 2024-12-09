import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';
import { importLogDown } from '../../styles';

export default makeStyles(theme => ({
  container: {
    flex: '0 0 35%',
    borderRadius: 4,
    padding: theme.spacing(2.5),
    paddingRight: 0,
    [theme.breakpoints.down(importLogDown)]: {
      paddingLeft: 0,
    },
    [theme.breakpoints.down('lg')]: {
      flex: '0 0 25%',
    },
  },
  backgroundItems: {
    borderRadius: 8,
    borderColor: Colors.tableStroke,
    border: '1px solid',
    padding: theme.spacing(1.25),
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: theme.spacing(2.75),
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: 600,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  primaryText: {
    fontSize: 12,
  },
  secondaryText: {
    marginLeft: 'auto',
    fontSize: 12,
  },
  categoryTitleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  listCategory: {
    paddingLeft: theme.spacing(0.625),
  },
  chevronRightIcon: {
    color: Colors.textBlack,
    width: 11,
    height: 9,
    marginRight: theme.spacing(1),
  },
}));
