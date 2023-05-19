import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../layout/theme/utils/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      visibility: 'hidden',
    },
    linkContainer: {
      boxShadow: `inset 0px 1px 1px -1px ${Colors.gray_goose}, inset 0px -1px 1px 0px ${Colors.gray_goose}`,
      padding: theme.spacing(1.875),
      flexGrow: 1,
    },
    activeLinkBox: {
      'color': Colors.navy,
      'textDecoration': 'none',
      'fontWeight': 600,
      'fontSize': '14px',
      'lineHeight': '24px',
      '& span': {
        color: Colors.navy,
      },
    },
    inActiveLinkBox: {
      color: Colors.font_gray,
      textDecoration: 'none',
      fontWeight: 600,
      fontFamily: 'Sora',
      fontSize: '14px',
      lineHeight: '24px',
    },
    activeLinkTitle: {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightBold,
    },
    activeLinkBody: {
      textDecoration: 'none',
      color: Colors.almost_black,
      fontFamily: 'Sora',
      fontSize: '14px',
      lineHeight: '24px',
    },
    inActiveLinkBody: {
      textDecoration: 'none',
      color: Colors.font_gray,
      fontFamily: 'Sora',
      fontSize: '14px',
      lineHeight: '24px',
    },
    selected: {
      background: Colors.background_white,
    },
    details: {
      '&.MuiExpansionPanelDetails-root': {
        display: 'block',
      },
    },
    displayStatus: {
      fontSize: '14px',
      fontWeight: 'normal',
    },
  }),
);
