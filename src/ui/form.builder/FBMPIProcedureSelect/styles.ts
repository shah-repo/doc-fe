import { makeStyles } from '@material-ui/core';
import { grayDotStyles } from '../../dashboard.new/line.items/common/styles';
import { Colors } from '../../layout/theme-next';

export default makeStyles((theme) => ({
  ...grayDotStyles(theme, {
    marginLeft: 5,
    marginRight: 5,
  }),
  dueDate: {
    textAlign: 'left',
    color: Colors.error,
    fontSize: 14,
    paddingBottom: 4,
  },
  // callOrDueDateExists: {
  //   paddingTop: '20 !important',
  //   color: 'red',
  //   paddingBottom: '20 !important',
  //   marginTop: '20 !important',
  //   marginBottom: '20 !important',
  // },
}));
