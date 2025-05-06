import { makeStyles, Theme } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles((theme: Theme) => ({
  button: {
    borderRadius: theme.shape.borderRadius / 2,
    padding: theme.spacing(0, 1.5),
    color: `${Colors.textBlack} !important`,
    margin: theme.spacing(0, 1),
  },
  buttonLabel: {
    display: 'block',
    maxWidth: 150,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: 12,
    fontWeight: 600,
    color: Colors.textBlack,
  },
  buttonIcon: {
    height: 36,
    fontSize: 10,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1.25),
    marginLeft: theme.spacing(0.5),
    borderLeft: `1px solid ${Colors.stroke}`,
    color: Colors.primary,

    '& svg:first-child': {
      fontSize: 12,
    },
  },
  menuItem: {
    maxWidth: 220,
    overflow: 'hidden',
  },
  menuItemText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  alertMessage: {
    maxWidth: 400,
    maxHeight: 400,
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
  },
}));
