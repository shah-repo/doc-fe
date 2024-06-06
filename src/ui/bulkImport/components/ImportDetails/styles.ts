import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles(theme => ({
  container: {
    display: 'block',
    margin: 'auto',
    maxWidth: 500,
  },
  select: {
    width: '100%',
  },
  formControl: {
    width: '100%',
  },
  selectLabel: {
    marginBottom: theme.spacing(2.5),
    fontSize: 17,
    fontWeight: 400,
  },
  contactSupportLink: {
    position: 'absolute',
    right: theme.spacing(-17.5),
    top: theme.spacing(2.125),
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 400,
  },
  hide: {
    display: 'none',
  },
}));
