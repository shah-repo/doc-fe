import { makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme-next/colors';

export const useStyles = makeStyles({
  attachmentHeaderContainer: {
    display: 'flex',
  },
  attachmentHeadText: {
    flex: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    fontSize: 12,
    fontWeight: 600,
    color: Colors.textBlack,
  },
});
