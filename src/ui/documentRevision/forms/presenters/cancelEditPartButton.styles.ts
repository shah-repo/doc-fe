import { makeStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export default makeStyles(theme => ({
  buttonIcon: {
    paddingLeft: 0,
    paddingRight: theme.spacing(0.25),
  },
  buttonText: {
    paddingRight: theme.spacing(1.25),
  },
  paper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(0.5),
    backgroundColor: Colors.white,
    boxShadow: `4px 4px 8px 4px ${Colors.blue_bell}`,
    right: theme.spacing(1.25),
    width: '560px',
  },
  controlOptionsInfo: {
    width: 16,
    height: 16,
    color: Colors.light_slate_blue,
  },
  heading: {
    color: Colors.dark_gray,
  },
  formDetails: {
    color: Colors.bright_grey,
    paddingLeft: theme.spacing(0.5),
  },
  optionsList: {
    listStyle: 'none',
    paddingLeft: 0,
    margin: theme.spacing(1, 0.5, 0.5, 0.5),
  },
  listItem: {
    marginBottom: theme.spacing(1),
  },
  listItemLabel: {
    fontSize: '13px',
    color: Colors.dark_gray,
  },
  listItemValue: {
    marginLeft: theme.spacing(0.5),
  },
  disabled: {
    backgroundColor: Colors.whitest_grey,
    color: Colors.gray,
    cursor: 'not-allowed',
    '&:hover': {
      backgroundColor: Colors.whitest_grey,
    },
  },
}));
