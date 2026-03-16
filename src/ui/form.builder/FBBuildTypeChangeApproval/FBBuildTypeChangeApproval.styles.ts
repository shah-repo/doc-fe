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
    },
    requestApprovalButton: {
      margin: 0,
      padding: 0,
      marginTop: '4px',
    },
    actionsContainer: {
      gap: '16px',
    },
    buttonGroup: {
      gap: '8px',
    },
    actionButton: {
      fontSize: '11px',
    },
  }),
);
