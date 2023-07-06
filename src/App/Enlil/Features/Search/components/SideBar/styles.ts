import { makeStyles } from '@material-ui/core/styles';
import { Colors } from '../../../../../../ui/layout/theme-next';

export default makeStyles((theme) => ({
  toolbar: {
    fontSize: 12,
    fontWeight: 600,
    height: 30,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.25, 0),
    margin: theme.spacing(0, 0, 1.25),
    borderBottom: `1px solid ${Colors.stroke}`,
  },
  selectButton: {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
}));
