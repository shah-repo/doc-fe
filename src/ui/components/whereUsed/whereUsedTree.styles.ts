import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export default makeStyles((theme) =>
  createStyles({
    mainDiv: {
      marginBottom: theme.spacing(2),
    },
    title: {
      display: 'flex',
      padding: theme.spacing(0.5),
      alignItems: 'center',
    },
    fullWidth: {
      width: '100%',
    },
    treeMap: {
      height: '75vh',
      margin: '40px',
      '& > div > div': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginBottom: theme.spacing(1),
      },
    },
    depthDiv: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
    },
    entry: {
      padding: theme.spacing(1, 1.5),
      borderRadius: theme.spacing(1),
      margin: theme.spacing(1.5),
      backgroundColor: Colors.white,
    },
    statusReleased: {
      border: `1px solid ${Colors.green}`,
      color: Colors.green,
    },
    statusDraft: {
      border: `1px solid ${Colors.bright_blue}`,
      color: Colors.bright_blue,
    },
    statusPendingChange: {
      border: `1px solid ${Colors.latest_yellow_varient}`,
      color: Colors.latest_yellow_varient,
    },
    metadataInfo: {
      margin: theme.spacing(0.25, 0),
      fontSize: '12px',
    },
    defaultStatus: {
      border: `1px solid ${Colors.font_gray}`,
      backgroundColor: Colors.white,
      color: Colors.font_gray,
    },
    disableRipple: {
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    customTooltip: {
      backgroundColor: Colors.black,
      whiteSpace: 'pre-wrap',
    },
    customArrow: {
      color: Colors.black,
    },
    titleHeading: {
      marginRight: theme.spacing(1.25),
      display: 'inline-block',
      fontWeight: 600,
      color: Colors.almost_black,
    },
    normalFontWeight: {
      fontWeight: 'normal',
    },
    boldFontWeight: {
      fontWeight: 600,
    },
    smallText: {
      fontSize: '12px',
    },
    link: {
      textDecoration: 'none',
      color: 'inherit',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    root: {
      pointerEvents: 'none',
    },
    paper: {
      pointerEvents: 'auto',
      width: '80%',
      maxWidth: '80%',
      minHeight: '80vh',
    },
    close: {
      height: 24,
      width: 24,
      backgroundColor: Colors.athens_gray,
      borderRadius: theme.spacing(0.75),
      margin: theme.spacing(0, 1.25),
    },
    loader: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: Colors.background_white,
      opacity: 0.7,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      zIndex: 1,
    },
    dialogTitleText: {
      display: 'flex',
      justifyContent: 'space-between',
      color: Colors.almost_black,
    },
    dialogDiv: {
      display: 'flex',
      fontWeight: 600,
    },
    dialogContent: {
      height: '72vh',
    },
  }),
);
