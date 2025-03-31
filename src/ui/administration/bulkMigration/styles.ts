import { makeStyles } from '@material-ui/core';
import { Colors as NextColors } from '../../layout/theme-next';
import { NextTheme } from '../../layout/theme-next/provider';
import Colors from '../../layout/theme/utils/colors';

export default makeStyles<NextTheme>(theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gridGap: theme.spacing(2.5, 3),
    padding: theme.spacing(3, 3, 0),
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
    marginTop: '16px',
  },
  innerBox: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
  },
  actionBox: {
    marginTop: '16px',
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
  },
  subtitle: {
    color: NextColors.textGray,
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
    position: 'relative',
    top: -4,
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
    maxWidth: '340px',
  },
  promptUserMsgStyle: {
    color: Colors.red,
    backgroundColor: Colors.light_red,
    padding: '8px',
    textAlign: 'center',
  },
  errMsgStyle: {
    color: Colors.red,
    backgroundColor: Colors.light_red,
    padding: '4px',
  },
  mappingRuleSchemaItemBox: {
    position: 'relative',
    marginTop: '8px',
    border: `1px solid ${NextColors.textGray}`,
    borderRadius: '2px',
    padding: '8px',
    width: '100%',
  },
  compactListItem: {
    marginBottom: '4px',
    '& .MuiListItemText-root': {
      marginBottom: 0,
    },
  },
  mappingArea: {
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
      fontSize: '12px',
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
    color: Colors.black,
  },

  refreshIconStyle: {
    cursor: 'pointer',
    marginLeft: '4px',
    fontSize: '16px',
  },

  /* Circle path for the motion */
  searchIcon: {
    fontSize: '16vw',
    animation: '$circularMove 4s linear infinite',
  },

  searchIconSmall: {
    fontSize: '16px',
  },

  blinking: {
    animation: '$slowBlink 3s ease-in-out infinite',
  },

  /* Keyframes for the circular motion */
  '@keyframes circularMove': {
    '0%': {
      transform: 'rotate(0deg) translate(32px) rotate(0deg)', // Adjust radius
    },
    '100%': {
      transform: 'rotate(360deg) translate(32px) rotate(-360deg)',
    },
  },

  '@keyframes slowBlink': {
    '0%': {
      opacity: 1, // Fully visible
    },
    '50%': {
      opacity: 0.3, // Faded out
    },
    '100%': {
      opacity: 1, // Fully visible
    },
  },
  drawerDialog: {
    width: '40vw', // Width of the side panel
    display: 'flex',
    flexDirection: 'column',
    height: '100%', // Full height of the drawer
  },
  drawerDialogPaper: {
    width: '40vw',
  },
  drawerContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1, // Allow sections to take full available height
    padding: '16px',
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
    rowGap: '16px',
    marginTop: '16px',
    paddingLeft: '20px',
  },
  width100: {
    width: '100%',
  },
  mappingTableRowHeight: {
    height: '32px',
  },
  mappingTableCell: {
    border: `1px solid ${Colors.dark_gray2}`,
  },
  boldWeight: {
    fontWeight: 'bold',
  },

}));
