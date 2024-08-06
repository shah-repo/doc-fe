import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles(theme => ({
  root: {
    maxWidth: 518,
    width: '100%',
  },
  container: {
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  title: {
    fontWeight: 600,
    fontSize: 16,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  searchBox: {
    display: 'flex',
    height: 60,
    alignItems: 'center',
    padding: theme.spacing(0, 3.75),
    border: `1px solid ${Colors.tableStroke}`,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    backgroundColor: Colors.tableHeader,
  },
  search: {
    marginLeft: 'auto',
    '& .MuiOutlinedInput-root': {
      width: 260,
      height: 30,
      paddingLeft: 0,
    },
    '& .MuiIconButton-root': {
      paddingRight: 0,
    },
  },
  listItem: {
    padding: theme.spacing(0.625, 3.75),
  },
  childrenContainer: {
    height: 500,
    overflowY: 'auto',
    border: `1px solid ${Colors.tableStroke}`,
    borderTopWidth: 0,
  },
  listItemContainer: {
    border: `1px solid ${Colors.lightGray}`,
    padding: theme.spacing(1.25, 1.875),
    backgroundColor: Colors.white,
    width: '100%',
    borderRadius: 3,
  },
  listItemText: {
    fontWeight: 400,
    fontSize: 14,
  },
  listSelectContainer: {
    display: 'flex',
    width: '100%',
    placeItems: 'center',
  },
  listSelectText: {
    fontWeight: 600,
    fontSize: 14,
  },
  selectContainer: {
    marginLeft: 'auto',
    width: 264,
    minWidth: 264,
    marginBottom: 0,

    '& > div:first-child': {
      marginBottom: 0,
    },
  },
  select: {
    height: 40,

    '& .MuiSelect-selectMenu': {
      fontSize: 14,
      fontFamily: 'Sora',
      fontWeight: 400,
    },
  },
}));
