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
  sectionContainer: {
    border: `1px solid ${Colors.stroke}`,
    borderRadius: '8px',
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1.5, 2),
    cursor: 'pointer',
    userSelect: 'none' as const,
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: 16,
    color: theme.palette.primary.main,
  },
  sectionCount: {
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  sectionChevron: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  approvalDivider: {
    height: '1px',
    backgroundColor: Colors.stroke,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  approvedStatus: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 700,
    fontSize: 14,
    gap: theme.spacing(0.5),
    color: Colors.success,
  },
  approvedIcon: {
    color: Colors.success,
    fontSize: 18,
  },
  approvedDate: {
    fontSize: 12,
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.25),
    textAlign: 'right' as const,
  },
  }),
);
