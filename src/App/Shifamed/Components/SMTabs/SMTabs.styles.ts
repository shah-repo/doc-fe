import { makeStyles } from '@material-ui/core';
import Colors from '../../../../ui/layout/theme/utils/colors';

export default makeStyles({
  root: {
    backgroundColor: Colors.alabaster,
  },
  tabs: {
    zIndex: 4,
    backgroundColor: Colors.alabaster,
    height: 26,
    width: '100%',
    fontSize: 12,
    padding: 0,
    borderBottom: `1px solid ${Colors.chinese_silver}`,
    minHeight: 26,
    maxHeight: 26,
    position: 'sticky',
    left: 0,
    right: 0,
    top: -10,
  },
  tab: {
    width: 'auto',
    minWidth: 40,
    height: 15,
    minHeight: 15,
    padding: 0,
    marginRight: 30,
    fontSize: 12,
  },
  indicator: {
    background: Colors.cerulean,
  },
});
