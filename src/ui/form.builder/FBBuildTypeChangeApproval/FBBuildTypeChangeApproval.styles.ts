import { createStyles, makeStyles } from '@material-ui/core';

export default makeStyles(() =>
  createStyles({
    approvalCard: {
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: '#fafafa',
    },
    avatar: {
      width: 56,
      height: 56,
      marginRight: 16,
      fontSize: '20px',
      fontWeight: 'bold',
      backgroundColor: 'var(--avatar-bg-color, #e0e0e0)',
    },
    requestApprovalButton: {
      margin: 0,
      padding: 0,
      marginTop: '4px',
    },
    actionsContainer: {
      gap: '16px',
      display: 'flex',
      alignItems: 'center',
    },
    buttonGroup: {
      gap: '8px',
      display: 'flex',
    },
    actionButton: {
      fontSize: '11px',
    },
    approvalApprovedGroupContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      marginY: 2,
      marginTop: 1,
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
      fontSize: '16px',
      marginBottom: 0.5,
    },
    approverEmail: {
      fontSize: '14px',
      color: 'text.secondary',
    },
    statusText: {
      fontWeight: 500,
      fontSize: '14px',
    },
  }),
);
