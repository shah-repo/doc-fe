import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      justifyContent: 'space-between',
      flexWrap: 'nowrap',
    },
    headerLeft: {
      display: 'flex',
      minWidth: 0,
      marginRight: theme.spacing(3.5),
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
    },
    status: {
      width: 'max-content',
      fontWeight: 700,
      fontSize: '12px',
      letterSpacing: 0,
    },
    statusDueInfewDays: {
      color: Colors.latest_yellow_varient,
    },
    statusOverdue: {
      color: Colors.latest_red_varient,
      textTransform: 'uppercase',
    },
    name: {
      fontWeight: 'bold',
      fontSize: '12px',
      lineHeight: '15px',
      display: 'inline',
      alignItems: 'center',
      marginLeft: '5px',
      color: Colors.almost_black,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      marginTop: '7px',
    },
    docIdAndTitle: {
      'fontWeight': 600,
      'fontSize': '14px',
      'lineHeight': '22px',
      'color': Colors.almost_black,
      '& > p': {
        margin: '0px',
      },
    },
    contentSection: {
      marginTop: '2%',
    },
    date: {
      fontWeight: 'normal',
      fontSize: '12px',
      lineHeight: '15px',
      color: Colors.font_gray,
    },
    avatar: {
      width: '30px',
      height: '30px',
      fontSize: '12px',
      fontWeight: 600,
      color: Colors.white,
      textTransform: 'uppercase',
    },
    margin5: {
      marginRight: '5px',
    },
  })
);
