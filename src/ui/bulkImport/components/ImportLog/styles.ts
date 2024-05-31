import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles(theme => ({
  container: {
    flex: '0 0 35%',
    borderRadius: 4,
    padding: 20,
  },
  backgroundItems: {
    borderRadius: 8,
    borderColor: Colors.tableStroke,
    border: '1px solid',
    padding: 10,
  },
  title: {
    fontFamily: 'Sora',
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 22,
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
    fontFamily: 'Sora',
  },
  secondaryText: {
    marginLeft: 'auto',
    fontSize: 12,
    fontFamily: 'Sora',
  },
  categoryTitleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  listCategory: {
    paddingLeft: 5,
  },
  chevronRightIcon: {
    color: Colors.textBlack,
    width: 11,
    height: 9,
    marginRight: 8,
  },
}));
