import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles(() =>
  createStyles({
    error: {
      color: Colors.error,
    },
    textArea: {
      width: '100%',
      '&:hover, &:focus, &:active': {
        outline: 'none',
        border: `1px solid ${Colors.statusDraft}`,
      },
    },
  }),
);
