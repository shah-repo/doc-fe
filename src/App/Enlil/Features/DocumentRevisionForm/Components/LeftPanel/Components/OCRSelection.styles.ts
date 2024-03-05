import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../../../../../../ui/layout/theme/utils/colors';

export default makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      borderBottom: `1px solid ${Colors.lightest_grey1}`,
      padding: theme.spacing(0.25, 1.875, 1.25, 3.12),
    },
    submitButtonDiv: {
      margin: theme.spacing(1.9, 2.5, 1.9, 2.5),
    },
    submitButton: {
      width: '100%',
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
      border: `2px solid ${Colors.almost_black}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxIconChecked: {
      borderColor: Colors.navy,
      backgroundColor: Colors.navy,
    },
    checkboxCheck: {
      color: Colors.white,
      fontSize: 12,
    },
  }),
);
