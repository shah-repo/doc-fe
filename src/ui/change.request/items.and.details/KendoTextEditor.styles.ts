import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles((theme: Theme) =>
  createStyles({
    error: {
      margin: 0,
      lineHeight: '1em',
      fontSize: '0.75rem',
      color: Colors.error,
    },
    textArea: {
      fontFamily: 'Sora',
      fontWeight: 400,
      fontSize: 14,
      width: '100%',
      maxWidth: '100%',
      padding: theme.spacing(0.875, 1, 0.875, 1),
      border: `1px solid ${Colors.stroke}`,
      '&:hover, &:focus, &:active': {
        outline: 'none',
        border: `1px solid ${Colors.statusDraft}`,
      },
    },
  }),
);
