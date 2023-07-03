import { makeStyles } from '@material-ui/core/styles';
import { Colors } from '../../../../ui/layout/theme-next';

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
  expandedIcon: {
    transform: 'rotate(180deg)',
  },
  collapsedIcon: {
    transition: theme.transitions.create('transform'),
    fontSize: 12,
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
  selectButton: {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  exportButton: {
    // color: Colors.textDisabled,
    cursor: 'pointer',
  },
  exportButtonIcon: {
    fontSize: 16,
    margin: theme.spacing(0, 1, 0, 0),
  },
  listRoot: {

  },
  listChild: {
    marginLeft: 32,
  },
  listItem: {
    position: 'relative',
    padding: theme.spacing(0, 0, 0, 2),

    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  toggleButton: {
    position: 'absolute',
    left: 0,
  },
  listCheckboxWrap: {
    padding: 0,
    width: 20,
    marginRight: `${theme.spacing(1)}px !important`,
  },
  listCheckbox: {
    padding: 0,
    margin: 0,

    '&.Mui-disabled': {
      opacity: 0.5,
    },
  },
  checkboxIcon: {
    width: 16,
    height: 16,
    borderRadius: 2,
    border: `2px solid ${Colors.textBlack}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxIconChecked: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  checkboxCheck: {
    color: Colors.white,
    fontSize: 12,
  },
}));
