import { makeStyles } from '@material-ui/core/styles';
import { Colors } from '../../../../../../ui/layout/theme-next';

export default makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridGap: '12px 24px',
    padding: theme.spacing(3),
    gridTemplate: 'min-content 32px auto / 250px auto',
  },
  grid: {
    gridArea: '3 / 2 / 4 / 3',
    position: 'relative',
  },
  sidebar: {
    gridArea: '2 / 1 / 4 / 2',
  },
  topbar: {
    gridArea: '2 / 2 / 3 / 3',
  },
  title: {
    gridArea: '1 / 2 / 2 / 3',
    fontWeight: 600,
    fontSize: 21,
  },
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
  exportButton: {
    cursor: 'pointer',
  },
  exportButtonIcon: {
    fontSize: 16,
    margin: theme.spacing(0, 1, 0, 0),
  },
  selectButton: {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
}));
