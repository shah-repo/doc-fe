import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: 560,
    },
    contenttitle: {
      position: 'static',
      marginBottom: theme.spacing(1.5),
      fontSize: 12,
      fontWeight: 600,
      color: Colors.textBlack,
    },
    radioGroup: {
      gap: theme.spacing(3.75),
      flexDirection: 'row',
      marginBottom: theme.spacing(4.5),
    },
    radio: {
      paddingTop: 11,
      '&:hover': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
      '&$checked': {
        color: Colors.primary,
        '&:hover': {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      },
    },
    radioLabel: {
      margin: theme.spacing(1.375, 0, 0, 0.625),
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 1,
      color: Colors.textBlack,
    },
    checkboxContainer: {
      marginLeft: theme.spacing(0),
      '&.Mui-disabled span.Mui-disabled': {
        color: Colors.textBlack,
      },
    },
    check: {
      marginRight: theme.spacing(1.25),
    },
    attachmentsContainer: {
      background: Colors.primaryHighlight,
      padding: theme.spacing(1.25, 1.5),
    },
    attachmentsContainerTitle: {
      fontWeight: 400,
      fontSize: 12,
    },
    attachmenstList: {
      paddingTop: theme.spacing(1.25),
      paddingBottom: theme.spacing(0),
    },
    attachmentListItem: {
      paddingLeft: theme.spacing(0),
      height: 35,
    },
    listItemIcon: {
      marginRight: '0px !important',
    },
    listItemText: {
      color: Colors.primary,
    },
    attachmentIcon: {
      color: Colors.primary,
      margin: theme.spacing(0, 0.875),
    },
    auditHistoryRadioGrp: {
      flexDirection: 'row',
    },
    auditContenttitle: {
      marginTop: theme.spacing(3.75),
      marginBottom: theme.spacing(0.5),
    },
    radioContainer: {
      marginLeft: theme.spacing(0),
    },
    loader: {
      gap: theme.spacing(1.25),
    },
    spinner: {
      animation: '$spin 1s linear infinite',
      fontSize: 20,
      color: Colors.black,
      marginRight: theme.spacing(1),
    },
    '@keyframes spin': {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    noteContainer: {
      background: Colors.white,
      padding: theme.spacing(1.25, 1.5),
      width: '100%',
      textAlign: 'left',
    },
    contentNote: {
      color: Colors.textBlack,
      fontSize: 14,
      fontWeight: 700,
      lineHeight: 2,
    },
    additionalText: {
      fontSize: 14,
      fontWeight: 400,
      color: Colors.textBlack,
      lineHeight: 2,
    },
  }),
);
