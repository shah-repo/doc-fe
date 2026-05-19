import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      '&:before': {
        content: "''",
        height: 40,
        width: 45,
        position: 'absolute',
        backgroundColor: Colors.gray,
        opacity: 0.1,
        transform: 'translate(-10px, -6px)',
        borderRadius: 11,
      },
    },
    loading: {
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 3,
    },
    loadingAtTop: {
      bottom: 'auto',
      top: 0,
    },
  }),
);
