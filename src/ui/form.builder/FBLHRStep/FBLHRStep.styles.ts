import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export const FBLHRStepStyles = makeStyles(() =>
  createStyles({
    button: {
      backgroundColor: Colors.navy,
      borderRadius: '100px',
      height: 36,
      minWidth: 180,
      marginTop: 0,
      marginBottom: 0,
      fontFamily: 'Sora',
      fontSize: 12,
      fontWeight: 600,
      color: Colors.white,
      border: 0,
      '&.Mui-disabled': {
        border: 'none',
        backgroundColor: Colors.whitest_grey,
        color: Colors.spanish_gray,
      },
      '&:hover': {
        backgroundColor: Colors.navy,
        border: 0,
      },
      padding: '12px 25px',
      textTransform: 'capitalize',
    },
    expansionPanelHedding: {
      Colors: Colors.navy,
    },
    panelSummary: {
      flexDirection: 'row-reverse',
      padding: 0,
      margin: 0,
      height: '55px',
      alignItems: 'center',
      '& .Mui-expanded': {
        transform: 'rotate(0deg)',
        height: '55px',
        alignItems: 'center',
      },
    },
    panelDetails: {
      marginLeft: '22px',
      marginRight: '22px',
      display: 'block',
    },
    panelhrtDetails: {
      padding: '10px 0px 0px 0px',
      display: 'block',
    },
    panelBorder: {
      marginBottom: 5,
      border: `1px solid ${Colors.gray_goose}`,
      borderRadius: '4px',
    },
    fontTitle: {
      fontSize: 12,
      fontWeight: 600,
      color: Colors.almost_black,
    },
    subTitle: {
      fontSize: 14,
      fontWeight: 400,
      color: Colors.almost_black,
      marginTop: 10,
    },
    borderColorIcon: {
      color: Colors.red,
    },
    lhrsDateWidthBox: {
      width: '40%',
    },
    lhrsDateBox: {
      display: 'flex',
      marginBottom: 2,
      justifyContent: 'space-between',
    },
    disabled: {
      background: Colors.whitest_grey,
    },
    stepLHR: {
      background: Colors.light_blue,
      color: Colors.navy,
    },
    normal: {
      background: Colors.navy,
      color: Colors.white,
    },
    lhrsStatusBox: {
      fontWeight: 700,
      fontSize: 12,
      color: Colors.almost_black,
      marginRight: 0.75,
    },
    statusSize: {
      fontSize: 17,
    },
    expand: {
      color: Colors.navy,
    },
    black: {
      color: Colors.almost_black,
    },
    labelBoxContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    labelBox: {
      display: 'flex',
      alignItems: 'center',
      flexGrow: 1,
    },
  }),
);
