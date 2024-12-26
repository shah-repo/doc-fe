import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';
import { NextTheme } from '../../layout/theme-next/provider';

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
    borderBottom: `1px solid ${Colors.stroke}`,
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
  title: {
    fontSize: 21,
    marginBottom: theme.spacing(0.5),
    color: Colors.textBlack,
  },
  subtitle: {
    color: Colors.textGray,
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
    color: Colors.textGray,
    fontSize: 12,
    minHeight: 0,
    cursor: 'pointer',

    '&.Mui-selected': {
      backgroundColor: Colors.lightGray,
      color: Colors.primaryDark,
      fontWeight: 600,

      '&:hover': {
        backgroundColor: Colors.lightGray,
      },
    },
    '&:hover': {
      backgroundColor: Colors.lightGray,
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
      borderBottom: `1px solid ${Colors.stroke}`,
    },
  },
  marginBottom: {
    marginBottom: theme.spacing(1),
  },
  formControl: {
    marginTop: theme.spacing(2),
  },
  popoverPaper: {
    padding: theme.spacing(1),
    maxWidth: '340px',
  },
  mappingRuleSchemaItemBox: {
    position: 'relative',
    marginTop: '8px',
    border: `1px solid ${Colors.textGray}`,
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
    color: Colors.statusDraftBorder,
    '&$checked': {
      color: Colors.statusDraftBorder,
    },
  },
  /* Container to define the boundary */
  searchIconContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
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
}));
