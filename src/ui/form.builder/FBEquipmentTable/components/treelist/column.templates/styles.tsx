import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../../layout/theme-next';

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
  listItemOption: {
    padding: 0,
    margin: 0,
  },
  dateInfo: {
    color: Colors.error,
  },
  expired: {
    color: Colors.error,
  },
  expiredIcon: {
    marginLeft: theme.spacing(1.25),
    marginRight: theme.spacing(0.625),
  },
  overdueLabel: {
    textTransform: 'uppercase',
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
  optionListItem: {
    paddingTop: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.25),
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
    ineHeight: 1.25,
  },
  iconGroup: {
    display: 'flex',
    gap: theme.spacing(1),
  },
}));
