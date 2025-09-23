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
  deleteIcon: {
    color: Colors.error,
  },
  titleInfoCell: (props) => ({
    maxWidth: 300,
    fontWeight: props?.hasChildren ? 600 : 400,
    fontSize: 14,
    lineHeight: '16.64px',
  }),
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
    borderBottom: `1px solid ${Colors.tableCellBorder} !important`,
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
    cursor: 'Pointer',
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
    lineHeight: '17.64px',
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
  uploadEvidenceField: {
    height: 20,
    padding: theme.spacing(0.625, 1.25),
    marginBottom: theme.spacing(1.25),
    '&:last-child': {
      marginBottom: theme.spacing(0),
    },
  },
  uploadEvidenceFieldIcon: {
    transform: 'rotate(45deg)',
    height: '0.7em',
    width: '0.7em',
  },
  uploadEvidenceFieldLabel: {
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
  attachmentName: {
    display: 'flex',

    '& svg:first-child': {
      transform: 'rotate(45deg)',
      height: '0.7em',
      width: '0.7em',
    },
    '& svg:last-child': {
      height: '1em',
      width: '1em',
    },
  },
  pointer: {
    cursor: 'pointer',
  },
  fileName: {
    width: 235,
    marginX: theme.spacing(0.75),
  },
}));
