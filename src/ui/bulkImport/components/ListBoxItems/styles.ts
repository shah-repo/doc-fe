import { makeStyles } from '@material-ui/core';
import { Colors as ColorsNext } from '../../../layout/theme-next';
import Colors from '../../../layout/theme/utils/colors';

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
    fontFamily: 'Sora',
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
    padding: '0 30px',
    border: `1px solid ${ColorsNext.tableStroke}`,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    backgroundColor: ColorsNext.tableHeader,
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
    padding: '5px 30px',
  },
  childrenContainer: {
    height: 500,
    overflowY: 'auto',
    border: `1px solid ${ColorsNext.tableStroke}`,
    borderTopWidth: 0,
  },
  listItemContainer: {
    border: `1px solid ${Colors.chinese_silver}`,
    padding: '10px 15px',
    backgroundColor: Colors.white,
    width: '100%',
    borderRadius: 3,
  },
  listItemText: {
    fontFamili: 'Sora',
    fontWeight: 400,
    fontSize: 14,
  },
  listSelectContainer: {
    display: 'flex',
    width: '100%',
    placeItems: 'center',
  },
  listSelectItem: {},
  listSelectText: {
    fontFamily: 'Sora',
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
