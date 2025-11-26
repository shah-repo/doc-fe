import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles((theme) =>
  createStyles({
    titleText: {
      color: Colors.textBlack,
      fontWeight: 600,
      fontSize: 12,
    },
    attachmentsHeader: {
      backgroundColor: Colors.gray,
      color: Colors.textBlack,
      height: 40,
      fontSize: 12,
      fontWeight: 600,
      display: 'flex',
      boxShadow: `inset 0px 1px 1px -1px ${Colors.lightGray3}, inset 0px -1px 1px 0px ${Colors.lightGray3}`,
      alignItems: 'center',
      padding: theme.spacing(0, 2),
    },
    attachmentsRow: {
      borderBottom: `1px solid ${Colors.lightGray3}`,
      lineHeight: 1.3,
    },
    attachmentsCell: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 42,
      padding: theme.spacing(1.5),
    },
  }),
);
