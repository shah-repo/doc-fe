import { makeStyles } from '@material-ui/core/styles';
import { Colors } from '../../../../../../../../ui/layout/theme-next';

export default makeStyles((theme) => ({
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
  expandedIcon: {
    transform: 'rotate(180deg)',
  },
  collapsedIcon: {
    transition: theme.transitions.create('transform'),
    fontSize: 12,
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
  listRoot: {

  },
  listChild: {
    marginLeft: 32,
  },
}));
