import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../../../../../layout/theme-next';

export default makeStyles((theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(2.5),
      border: `1px solid ${Colors.error}`,
      borderRadius: theme.shape.borderRadius * 1.5,
      background: Colors.errorHighlight,
      color: Colors.black,
    },
    header: {
      marginBottom: theme.spacing(1.5),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'top',
    },
    icon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 30,
      height: 30,
      borderRadius: 30,
      background: Colors.error,
      fontSize: 18,
      '& path': {
        fill: Colors.white,
      },
    },
    closeButton: {
      marginTop: theme.spacing(-1),
      marginRight: theme.spacing(-1),
      fontSize: 18,
      color: Colors.black,
    },
    title: {
      marginBottom: theme.spacing(1),
      fontWeight: 600,
      fontSize: '1rem',
    },
    content: {
      fontSize: '0.75rem',
      lineHeight: '1.25rem',
    },
  }),
);
