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
        width: 'fit-content',
      },
    },
    depthDivPart: {
      width: '240px',
    },
    depthDivLot: {
      width: '360px',
    },
    entry: {
      padding: theme.spacing(1, 1.5),
      borderRadius: theme.spacing(1),
      margin: theme.spacing(1.5),
      backgroundColor: Colors.light_gray,
      border: `1px solid ${Colors.gray}`,
      width: '60%',
    },
    metadataInfo: {
      margin: theme.spacing(0.75, 0, 0.5, 0),
      fontSize: '12px',
    },
    mainContent: {
      margin: theme.spacing(0.5, 0, 0.75, 0),
    },
    name: {
      color: Colors.dark_gray,
      fontWeight: 500,
    },
    chip: {
      display: 'flex',
      flexDirection: 'row',
      padding: '0px !important',
      borderRadius: 3,
      background: Colors.white,
      fontWeight: 700,
      fontSize: '10px',
      lineHeight: '13px',
      textTransform: 'uppercase',
      alignItems: 'center',
      justifyContent: 'center',
    },
    GREEN_STATUS: {
      color: Colors.green_blue,
    },
    RED_STATUS: {
      color: Colors.latest_red_varient,
    },
    CLOSED_STATUS: {
      color: Colors.dawn,
    },
    PENDING_STATUS: {
      color: Colors.school_bus_yellow,
    },
    GRAY_STATUS: {
      color: Colors.mandy,
    },
    WIP_STATUS: {
      color: Colors.raven,
    },
    undefined: {
      color: Colors.dodger_blue,
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
