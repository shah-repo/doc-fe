import { lighten, makeStyles } from '@material-ui/core';
import { Colors as NextColors } from '../../layout/theme-next';
import Colors from '../../layout/theme/utils/colors';

const ADD_ROW_COLUMN_WIDTH_PERCENT = 4;

export default makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gridGap: theme.spacing(2.5, 3),
    padding: theme.spacing(3, 3, 0),
  },
  rulesTitle: {
    flexGrow: 1,
  },
  previewSection: {
    height: 'calc(100vh - 70px)',
    padding: theme.spacing(2),
  },
  previewMessageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '70vh',
  },
  previewProgressIcon: {
    verticalAlign: 'middle',
    marginRight: theme.spacing(1),
  },
  grey: {
    backgroundColor: Colors.hint_gray,
  },
  flexBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'items-center',
    gridGap: theme.spacing(2.5, 3),
  },
  flexBoxColumn: {
    display: 'flex',
    flexDirection: 'column',
    gridGap: theme.spacing(2.5, 3),
  },
  header: {
    borderBottom: `1px solid ${NextColors.stroke}`,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(2.5),
    width: '100%',
  },
  boxForSelection: {
    width: '40%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
  },
  innerBox: {
    display: 'flex',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  actionBox: {
    marginTop: theme.spacing(2),
    gridGap: 0,
    alignItems: 'center',
  },
  width40: {
    width: '40%',
  },
  title: {
    fontSize: 21,
    marginBottom: theme.spacing(0.5),
    color: NextColors.textBlack,
    fontWeight: 600,
  },
  subtitle: {
    color: NextColors.textGray,
    fontWeight: 400,
    fontSize: 14,
  },
  migrateInfo: {
    color: NextColors.textBlack,
    fontWeight: 600,
    fontSize: 14,
  },
  smallText: {
    fontSize: 12,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    whiteSpace: 'nowrap',
    flexWrap: 'wrap',
    gap: theme.spacing(1, 1.25),
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5, 1.25),
  },
  dateTimeLabel: {
    fontSize: 12,
    margin: theme.spacing(0.5, 0),
  },
  progress: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  list: {
    padding: 0,
  },
  listItem: {
    borderRadius: 4,
    padding: theme.spacing(1, 1.25),
    marginBottom: theme.spacing(0.5),
    color: NextColors.textGray,
    fontSize: 12,
    minHeight: 0,
    cursor: 'pointer',

    '&.Mui-selected': {
      backgroundColor: NextColors.lightGray,
      color: NextColors.primaryDark,
      fontWeight: 600,

      '&:hover': {
        backgroundColor: NextColors.lightGray,
      },
    },
    '&:hover': {
      backgroundColor: NextColors.lightGray,
    },
  },
  panels: {
    paddingBottom: theme.spacing(3),
  },
  formSchemaPanel: {
    maxHeight: '70vh',
    overflow: 'hidden',
    overflowY: 'auto',

    '& p': {
      wordBreak: 'break-all',
      wordWrap: 'break-word',
      paddingBottom: theme.spacing(0.5),
      borderBottom: `1px solid ${NextColors.stroke}`,
    },
  },
  marginBottom: {
    marginBottom: theme.spacing(1),
  },
  zeroMarginBottom: {
    marginBottom: theme.spacing(0),
  },
  formControl40: {
    marginTop: theme.spacing(2),
    width: '40%',
  },
  formControl60: {
    marginTop: theme.spacing(2),
    width: '60%',
  },
  popoverPaper: {
    padding: theme.spacing(1),
    maxWidth: 340,
  },
  promptUserMsgStyle: {
    color: Colors.blue,
    backgroundColor: Colors.light_gray_blue,
    padding: theme.spacing(1),
    textAlign: 'center',
  },
  errMsgStyle: {
    color: Colors.red,
    backgroundColor: Colors.light_red,
    padding: theme.spacing(0.5),
  },
  mappingRuleSchemaItemBox: {
    position: 'relative',
    marginTop: theme.spacing(1),
    border: `1px solid ${NextColors.textGray}`,
    borderRadius: theme.spacing(0.25),
    padding: theme.spacing(1),
    width: '100%',
  },
  rulesText: {
    fontSize: 14,
  },
  compactListItem: {
    marginBottom: theme.spacing(0.5),
    fontSize: 14,
    '& .MuiListItemText-root': {
      marginBottom: 0,
    },
  },
  mappingArea: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > div > div': {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: theme.spacing(1),
    },
  },
  mappingSwitcher: {
    '& span': {
      fontSize: 12,
    },
  },
  switchBase: {
    color: NextColors.statusDraftBorder,
    '&$checked': {
      color: NextColors.statusDraftBorder,
    },
  },
  /* Container to define the boundary */
  searchIconContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },

  blackSpan: {
    paddingLeft: theme.spacing(0.5),
    color: Colors.black,
  },

  refreshIconStyle: {
    cursor: 'pointer',
    marginLeft: theme.spacing(0.5),
    fontSize: 16,
  },
  revsTableRefreshBox: {
    display: 'flex',
    alignItems: 'center',
    flex: '1',
    fontSize: 12,
  },
  revsTableRefreshText: {
    display: 'flex',
    alignItems: 'center',
  },

  /* Circle path for the motion */
  searchIcon: {
    fontSize: '16vw',
    animation: '$circularMove 4s linear infinite',
  },

  searchIconSmall: {
    fontSize: 16,
  },

  blinking: {
    animation: '$slowBlink 3s ease-in-out infinite',
  },

  /* Keyframes for the circular motion */
  '@keyframes circularMove': {
    '0%': {
      transform: 'rotate(0deg) translate(32px) rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg) translate(32px) rotate(-360deg)',
    },
  },

  '@keyframes slowBlink': {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.3,
    },
    '100%': {
      opacity: 1,
    },
  },
  drawerDialogPaper: {
    width: '40vw',
    display: 'flex',
    flexDirection: 'column',
  },
  drawerDialogContent: {
    flexGrow: 1,
    fontSize: 14,
    overflowY: 'auto',
    padding: theme.spacing(2),
    maxHeight: 'calc(100vh - 70px)',
  },
  drawerDialogCloseButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  drawerList: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: theme.spacing(2),
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(2.5),
  },
  mappingTableRowHeight: {
    height: 32,
  },
  mappingTableCell: {
    border: `1px solid ${Colors.dark_gray2}`,
  },
  approvalRequirementsBox: {
    padding: theme.spacing(1.5),
    fontSize: 14,
    backgroundColor: Colors.background_blue,
    borderRadius: '4px',
  },
  approvalRequirementsBoxText: {
    marginBottom: theme.spacing(0.5),
    fontSize: 14,
    color: Colors.light_gray_II,
  },
  approvalRequirementsBoxEmail: {
    fontWeight: 'bold',
    color: Colors.bright_blue,
    fontSize: 14,
    display: 'block',
  },
  approvalRequirementsRequiredGroupsBox: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(0.25),
    display: 'flex',
    gap: theme.spacing(1),
  },
  employeePasswordText: {
    width: '100%',
    border: 0,
    borderBottom: `1px solid ${Colors.gray_goose}`,
  },
  spaceBetweenFlex: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  dialogActions: {
    padding: theme.spacing(1, 3),
    background: NextColors.darkGray,
  },
  buttonSpacing: {
    marginLeft: theme.spacing(1),
  },
  simpleFlex: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  simpleColumnFlex: {
    display: 'flex',
    flexDirection: 'column',
  },
  boldWeight: {
    fontWeight: 'bold',
  },
  marginBottom8: {
    marginBottom: theme.spacing(1),
  },
  marginY8: {
    margin: theme.spacing(1, 0),
  },
  marginTop8: {
    marginTop: theme.spacing(1),
  },
  marginTop16: {
    marginTop: theme.spacing(2),
  },
  padding8: {
    paddingTop: theme.spacing(1),
  },
  greenCheckCircle: {
    color: Colors.green,
    fontSize: 15,
  },
  redWarning: {
    color: Colors.red,
    fontSize: 15,
  },
  relative: {
    position: 'relative',
  },
  width100: {
    width: '100%',
  },
  width50: {
    width: '50%',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  textRightAlign: {
    textAlign: 'right',
    fontSize: 12,
  },
  verticalAlignTableRow: {
    verticalAlign: 'baseline',
  },
  mappingDialogSelectionOption: {
    fontSize: '84%',
    padding: theme.spacing(0.25),
    backgroundColor: Colors.gray_goose,
  },
  mappingDialogInstructions: {
    marginTop: 0,
    marginBottom: theme.spacing(3),
    paddingLeft: theme.spacing(2.5),
    width: '80%',
  },
  mappingAreaTitle: {
    display: 'inline-block',
    marginBottom: theme.spacing(1),
    color: NextColors.textBlack,
    fontWeight: 600,
    fontSize: 14,
  },
  toSchemaItem: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    overflow: 'auto',
  },
  selectedFromSchemaItem: {
    color: Colors.green,
    position: 'absolute',
    right: 6,
    top: 2,
  },
  doneAllIcon: {
    color: Colors.green,
    position: 'relative',
    top: 6,
  },
  chip: {
    padding: theme.spacing(0, 0.5),
    height: 28,
    margin: theme.spacing(0, 0.5, 0.5, 0),
  },
  previewDrawerProgress: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  previewDrawerDialog: {
    width: '80vw',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  previewDrawerDialogPaper: {
    width: '80vw',
  },
  previewDrawerContent: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row',
  },
  previewDrawerLeftSection: {
    width: '25%',
    borderRight: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),
    boxSizing: 'border-box',
    height: '96vh',
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  previewDrawerRightSection: {
    width: '75%',
    padding: theme.spacing(2),
    boxSizing: 'border-box',
    height: '96vh',
  },
  rightSectionFieldsUnmatched: {
    height: '20%',
    overflow: 'auto',
  },
  rightSectionMappingView: {
    height: '75%',
    overflow: 'auto',
  },
  previewDrawerDialogCloseButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  previewDrawerLeftSectionListItem: {
    borderRadius: 4,
    padding: theme.spacing(1, 1.25),
    marginBottom: theme.spacing(0.5),
    color: NextColors.textGray,
    fontSize: 12,
    minHeight: 0,
    cursor: 'pointer',

    '&.Mui-selected': {
      backgroundColor: NextColors.lightGray,
      color: NextColors.primaryDark,
      fontWeight: 600,

      '&:hover': {
        backgroundColor: NextColors.lightGray,
      },
    },
    '&:hover': {
      backgroundColor: NextColors.lightGray,
    },
  },
  previewDrawerMappingRuleSchemaItemBox: {
    position: 'relative',
    marginTop: theme.spacing(1),
    borderRadius: '2px',
    padding: theme.spacing(1),
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    overflow: 'auto',
  },
  optionMapperContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  optionMapperDrawerListContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: theme.spacing(2.5),
  },
  optionMapperDrawerOptionsList: {
    width: '45%',
    border: `1px solid ${Colors.gray}`,
    overflowY: 'auto',
  },
  optionMapperDrawerListItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: Colors.default,
    },
  },
  optionMapperDrawerSelectedListItem: {
    backgroundColor: Colors.chinese_silver,
  },
  optionMapperDrawerMappedListItem: {
    backgroundColor: Colors.pale_green,
  },
  revsTableRoot: {
    width: '100%',
    '& > *': {
      borderBottom: 'unset',
    },
  },
  revsTableBody: {
    maxHeight: '50vh',
    overflow: 'hidden',
    overflowY: 'auto',
  },
  revsTablePopoverPaper: {
    padding: theme.spacing(1),
  },
  revsTableProgress: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  revsTablePrimaryText: {
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '21px',
    color: Colors.dark_jungle_green,
  },
  revsTableFlexBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'items-center',
  },
  revsTableFlexBoxColumn: {
    display: 'flex',
    flexDirection: 'column',
    gridGap: theme.spacing(0.25, 1),
  },
  revsTableDateTimeLabel: {
    fontSize: 12,
    padding: theme.spacing(0, 1),
  },
  revsTableSelectedHighlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  '.MuiTablePagination-selectIcon': {
    top: 0,
    left: 1,
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  revsTableCheckboxCell: {
    width: '8%',
    padding: theme.spacing(1, 0.5),
  },
  revsTableHeaderCell: {
    overflow: 'hidden',
    padding: theme.spacing(1, 0.5),
  },
  checkboxRowContent: {
    display: 'flex',
    alignItems: 'center',
  },
  checkboxRowContentDone: {
    color: NextColors.success,
  },
  checkboxRowContentFailed: {
    color: NextColors.error,
  },
  checkboxRowContentInProgress: {
    color: NextColors.warning,
  },
  deleteIcon: {
    cursor: 'pointer',
    color: Colors.red,
    marginRight: theme.spacing(0.5),
  },
  tableCellHiddenOverflow: {
    overflow: 'hidden',
    wordWrap: 'break-word',
  },
  zeroTopBottomPadding: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  revsTableRefreshIcon: {
    cursor: 'pointer',
    marginLeft: theme.spacing(0.5),
    fontSize: 16,
  },
  cursorPointer: {
    cursor: 'pointer',
  },
  revsTableFixedLayout: {
    width: '100%',
    tableLayout: 'fixed',
  },
  noPointerEvents: {
    pointerEvents: 'none',
  },
  listItemText: {
    fontSize: 14,
  },
  clear: {
    padding: 0,
    cursor: 'pointer',
  },
  fromRevContainer: {
    width: '32%',
  },
  toRevContainer: {
    width: '56%',
  },
  mappingView: {
    maxHeight: '72vh',
    overflow: 'auto',
  },
  mappingInfo: {
    marginBottom: theme.spacing(1),
  },
  pointer: {
    cursor: 'pointer',
  },
  groupNameContainer: {
    marginLeft: theme.spacing(1),
    display: 'flex',
  },
  groupName: {
    marginLeft: theme.spacing(0.5),
  },
  username: {
    width: 0,
  },
  dialogContentText: {
    fontWeight: 400,
    fontSize: 14,
    color: NextColors.textBlack,
    'white-space': 'break-spaces',
  },
  selectedRevInfo: {
    fontWeight: 600,
    fontSize: 14,
    color: NextColors.textBlack,
    'white-space': 'break-spaces',
  },
  jobInfo: {
    fontSize: 14,
  },
  isRequired: {
    color: NextColors.error,
    fontSize: 16,
  },
  currentMappingsContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(0, 3.5),
  },
  fixedWidthColumn: {
    width: ADD_ROW_COLUMN_WIDTH_PERCENT,
  },
}));
