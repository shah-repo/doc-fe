import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../../../layout/theme/utils/colors';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      overflow: 'visible',
    },
    contentRoot: {
      'padding': theme.spacing(2),
      'overflow': 'visible',
      '& .MuiFormControl-root:last-child': {
        marginBottom: theme.spacing(1),
      },
    },
    formContent: {
      background: Colors.white_smoke,
    },
    fieldsContent: {
      borderTop: 'none',
    },
    titleRoot: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(2),
    },
    actionsRoot: {
      padding: theme.spacing(1),
    },
  }),
);

export default useStyles;
