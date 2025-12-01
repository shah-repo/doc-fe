import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export const styles = makeStyles((theme) => ({
  actions: {
    gap: theme.spacing(1.25, 1.25),
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1.25),
    backgroundColor: Colors.primaryLight,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    position: 'absolute',
    zIndex: 3,
    right: 0,
    top: '100%',
  },
  activeCheckbox: {
    margin: theme.spacing(0.75, 0, 0),
    width: 20,
  },
  progress: {
    marginTop: theme.spacing(0.5),
  },
  optionWrap: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  titleInfoCell: {
    maxWidth: 300,
    fontSize: 14,
    lineHeight: 1.2,
  },
  boldText: {
    fontWeight: 600,
  },
  normalText: {
    fontWeight: 400,
  },
  idCellEditWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  defaultIcon: {
    height: 14,
    width: 14,
  },
  expandCell: {
    marginRight: theme.spacing(1),
  },
  disabled: {
    color: `${Colors.gray} !important`,
    pointerEvents: 'none',
  },
  cellBorderBottom: {
    borderBottom: `1px solid ${Colors.tableStroke} !important`,
    borderLeft: '0 !important',
  },
  nameCell: (props) => ({
    'vertical-align': 'middle',
    marginLeft: props.isEditMode ? 0 : theme.spacing(1),
  }),
  expand: {
    cursor: 'pointer',
  },
  addChildLotIcon: {
    color: Colors.primary,
  },
  lotNameCell: {
    verticalAlign: 'middle',
    marginLeft: 0,
  },
  lotInfoWrapper: {
    '& button': {
      marginLeft: theme.spacing(1.25),
    },
  },
  flexJustifyBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lotInfoId: {
    marginRight: theme.spacing(1.25),
  },
  viewIcon: {
    color: Colors.textGray,
  },
  link: {
    color: `${Colors.primary} !important`,
    cursor: 'pointer',
    textDecoration: 'initial !important',
    '&:hover': {
      textDecoration: 'underline !important',
    },
  },
  scanIcon: {
    marginLeft: theme.spacing(1.25),
  },
  Cell: {
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 1.25,
  },
  employeeResponseFields: {
    marginBottom: theme.spacing(1.25),
    '&:last-child': {
      marginBottom: theme.spacing(0),
    },
  },
  assigneeAction: {
    display: 'flex',
    padding: theme.spacing(1, 1.75),
    minHeight: 30,
  },
  assigneeActionStatusContainer: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 12,
  },
  attachmentField: {
    height: 20,
    padding: theme.spacing(0.625, 1.25),
    marginBottom: theme.spacing(1.25),
    '&:last-child': {
      marginBottom: theme.spacing(0),
    },
  },
  attachmentFieldIcon: {
    transform: 'rotate(45deg)',
    height: '0.7em',
    width: '0.7em',
  },
  attachmentFieldLabel: {
    fontSize: 12,
    fontWeight: 400,
    marginLeft: theme.spacing(0.75),
  },
  attachmentsContainer: {
    color: Colors.primary,
    fontSize: 12,
    marginBottom: theme.spacing(1.25),
    overflow: 'auto',
    maxHeight: 105,
    width: 'fit-content',
    '&:last-child': {
      marginBottom: theme.spacing(0),
    },
  },
  attachmentIcon: {
    color: Colors.primary,
    transform: 'rotate(45deg)',
    fontSize: 18,
  },
  attachmentName: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '100%',

    '& svg': {
      fontSize: 16,
    },
  },
  fileRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flex: 1,
    minWidth: 0,
  },
  fileName: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    color: Colors.primary,
    cursor: 'pointer',

    '& > div': {
      flex: 1,
      minWidth: 0,
      display: 'block',
    },
  },
  deleteIcon: {
    fontSize: 16,
    cursor: 'pointer',
    color: Colors.error,
  },
  attachmentNameContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    gap: theme.spacing(1),
  },
  materialCellWrap: {
    display: 'flex',
    '& div': {
      width: '90%',
    },
  },
  quantityShortInfoIcon: {
    cursor: 'pointer',
    marginLeft: theme.spacing(0.625),
  },
}));
