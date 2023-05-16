import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../../../layout/theme/utils/colors';

export default makeStyles((theme) =>
  createStyles({
    outputGrey: {
      color: `${theme.palette.text.disabled}`,
    },
    previewColumn: {
      flex: '0 0 auto',
    },
    previewButton: {
      'height': 40,
      'padding': '10px 20px',
      'margin': '0 0 20px 0',
      'borderRadius': 100,
      'color': Colors.white,
      '&, &:hover': {
        backgroundColor: Colors.navy,
      },
      '& svg': {
        marginRight: 10,
      },
    },
    previewButtonDisabled: {
      color: `${Colors.white} !important`,
      backgroundColor: `${Colors.dawn} !important`,
    },
    previewDialog: {
      backgroundColor: Colors.alabaster,
    },
  }),
);
