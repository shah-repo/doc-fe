import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles((theme) =>
  createStyles({
    tooltipContainer: {
      marginLeft: theme.spacing(0.5),
      marginTop: theme.spacing(-0.4),
      cursor: 'pointer',
    },
    formHelperTextError: {
      color: `${Colors.error} !important`,
    },
  }),
);
