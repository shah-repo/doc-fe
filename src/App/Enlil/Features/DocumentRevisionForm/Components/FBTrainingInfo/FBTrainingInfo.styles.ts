import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../../../../../ui/layout/theme/utils/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      background: Colors.white,
      border: `1px solid ${Colors.mild_wind_blue}`,
      boxSizing: 'border-box',
      borderRadius: '4px',
      marginTop: '10px',
    },
    itemCount: {
      fontFamily: 'Sora',
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '15px',
      color: Colors.font_gray,
      marginRight: '-8px',
    },
    itemHeader: {
      'fontFamily': 'Sora',
      'fontWeight': 600,
      'fontSize': '16px',
      'lineHeight': '20px',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
    },
    expandedItemHeader: {
      backgroundColor: Colors.navy,
    },
    collapsedItemHeader: {
      backgroundColor: Colors.almost_black,
    },
    listItem: {
      background: Colors.white,
      padding: '20px 15px 20px 40px',
      height: '68px',
    },
    stateListItem: { height: '45px', cursor: 'pointer' },
    avatar: {
      width: '45px',
      height: '45px',
      borderRadius: '50%',
      margin: theme.spacing(0, 1, 0, 1),
      fontSize: '18px',
      color: Colors.white,
      background: Colors.aqua_blue,
      fontWeight: 600,
    },
    stateText: {
      fontWeight: 'bold',
      fontSize: '12px',
      lineHeight: '21px',
      letterSpacing: '0.5px',
      color: Colors.almost_black,
    },
    nameText: {
      fontWeight: 'bold',
      fontSize: '14px',
      lineHeight: '21px',
      letterSpacing: '0.5px',
      color: Colors.almost_black,
    },
    emailText: {
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '21px',
      letterSpacing: '0.5px',
      color: Colors.font_gray,
      overflowWrap: 'anywhere',
    },
    dateText: {
      fontWeight: 'normal',
      fontSize: '12px',
      lineHeight: '21px',
      letterSpacing: '0.5px',
      color: Colors.font_gray,
    },
    successIcon: {
      top: '3px',
      right: '3px',
      width: '14px',
      height: '14px',
      position: 'relative',
    },
    noTrainingMessage: {
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '18px',
      textAlign: 'center',
      color: Colors.font_gray,
      width: '306px',
    },
    noDataDiv: {
      paddingTop: '30px',
      textAlign: 'center',
    },
    divider: {
      marginLeft: '50px',
      marginRight: '111px',
    },
  })
);
