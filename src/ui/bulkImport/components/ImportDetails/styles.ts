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
    marginBottom: 20,
    fontSize: 17,
    fontWeight: 400,
    fontFamily: 'Sora',
  },
  contactSupportLink: {
    position: 'absolute',
    right: -140,
    top: 17,
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 400,
  },
  hide: {
    display: 'none',
  },
}));
