import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles(theme => ({
  chip: {
    fontSize: 12,
    padding: theme.spacing(0.25, 1),
    height: 'auto',
    borderRadius: theme.shape.borderRadius / 2,
    border: `1px solid ${Colors.stroke}`,
    backgroundColor: Colors.fieldDisabled,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: Colors.fieldDisabled,
    },
    '&:focus': {
      backgroundColor: Colors.fieldDisabled,
    },
    '&:active': {
      backgroundColor: Colors.fieldDisabled,
    },
  },
  chipIcon: {
    color: Colors.primaryLight,
    width: 0,
    overflow: 'hidden',
    transition: theme.transitions.create('width', { duration: 100 }),
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  chipIconActive: {
    width: 16,
  },
  chipActive: {
    backgroundColor: Colors.primaryBg,
    borderColor: Colors.primaryLight,
  },
  options: {
    margin: theme.spacing(-0.5, 0),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1, 1),
    marginLeft: theme.spacing(1),
  },
  label: {
    display: 'flex',
    alignItems: 'center',
  },
  labelWithAlert: {
    justifyContent: 'space-between',
  },
  qualityAlert: {
    color: Colors.error,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5, 0.5),
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
  attributes: {
    fontSize: 12,
    color: Colors.textGray,
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  outOfRange: {
    padding: theme.spacing(0, 1.5),
  },
}));
