import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../../../../layout/theme-next';

export default makeStyles((theme) => ({
  deleteButton: {
    color: Colors.error,
  },
  activateButton: {
    color: Colors.success,
  },
  groupCheckBox: {
    marginRight: theme.spacing(2.125),
    marginLeft: theme.spacing(3.5),
  },
  activatePhaseButton: {
    marginLeft: theme.spacing(1),
    color: Colors.success,
    cursor: 'pointer',
  },
  phaseDeleteButton: {
    marginLeft: theme.spacing(1),
    color: Colors.error,
    cursor: 'pointer',
  },
  editButtons: {
    width: 20,
    height: 20,
  },
  autocomplete: {
    padding: theme.spacing(0.625),
  },
  container: {
    width: '95%',
  },
  editContainer: {
    width: '100%',
  },
  buttons: {
    marginRight: theme.spacing(1.2),
  },
  toggleExpandCollapse: {
    width: 15,
    height: 15,
    cursor: 'pointer',
  },
  addPhaseButton: {
    paddingLeft: theme.spacing(4.25),
  },
  actions: {
    gap: theme.spacing(1.25, 1.25),
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1.25),
    backgroundColor: Colors.primaryLight,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    position: 'absolute',
    zIndex: 3,
    right: 0,
    top: '100%',
  },
  deleteIcon: {
    color: Colors.error,
  },
  headerButton: {
    marginRight: theme.spacing(0.675),
    color: Colors.primary,
  },
  cellStyle: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(0.5, 0.5),
  },
}));
