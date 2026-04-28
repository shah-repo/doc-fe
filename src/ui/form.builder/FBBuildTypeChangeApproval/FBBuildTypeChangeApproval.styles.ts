import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme-next/colors';

export default makeStyles((theme) =>
  createStyles({
    label: {
      float: 'left',
      color: theme.palette.text.primary,
      fontSize: 16,
      lineHeight: 1.5,
      fontWeight: 600,
      marginBottom: 12,
      display: 'block',
    },
    approvalCard: {
      border: `1px solid ${Colors.stroke}`,
      borderRadius: '8px',
      backgroundColor: Colors.gray,
    },
    avatar: {
      width: 56,
      height: 56,
      marginRight: 16,
      fontSize: 20,
      fontWeight: 'bold',
      backgroundColor: `var(--avatar-bg-color, ${Colors.stroke})`,
    },
    requestApprovalButton: {
      margin: 0,
      padding: 0,
      marginTop: theme.spacing(0.5),
    },
    actionsContainer: {
      gap: theme.spacing(2),
      display: 'flex',
      alignItems: 'center',
    },
    buttonGroup: {
      gap: theme.spacing(1),
      display: 'flex',
    },
    actionButton: {
      fontSize: 11,
    },
    approvalApprovedGroupContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      marginY: 2,
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    ownersWarningContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      marginBottom: 4,
      marginTop: 1,
    },
    ownerItemContainer: {
      display: 'flex',
      marginRight: 2.5,
    },
    approvalInfoContainer: {
      display: 'flex',
      alignItems: 'center',
      flex: 1,
    },
    approverName: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 0.5,
    },
    approverEmail: {
      fontSize: 14,
      color: 'text.secondary',
    },
    statusText: {
      fontWeight: 500,
      fontSize: 14,
    },
  deleteChip: {
      ...theme.typography.subtitle1,

      '& .chip-delete': {
        left: 0,
        padding: theme.spacing(0, 0.75, 0, 2),
        background: Colors.errorHighlight,
      },
      '& .chip-delete-icon': {
        transform: 'translate(0, 150%)',
      },
    },
  }),
);
