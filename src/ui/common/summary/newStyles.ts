import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    descriptionContainer: {
      'border': '0 !important',
      'maxHeight': '150px',
      'overflow': 'auto',
      'fontSize': '14px',
      'display': 'flex',
      '&.ql-container.ql-snow': {
        'border': 0,
        '& .ql-editor': {
          padding: 0,
          color: '#474747 !important',
        },
      },
      'whiteSpace': 'pre-line',
    },
    btnStyle: {
      fontSize: '14px',
      color: Colors.navy,
    },
    container: {
      paddingTop: '6px !important',
    },
    title: {
      fontWeight: 600,
      fontSize: '19px',
      lineHeight: '24px',
      left: '4px',
      top: '40px',
    },
    moreOrLess: (isClamped: boolean) => ({
      'color': Colors.dodger_blue,
      'padding': '0',
      'fontSize': '14px',
      'display': isClamped ? 'inherit' : 'none',
      'margin': 0,
      'textTransform': 'lowercase',
      '&:hover': {
        background: 'unset',
      },
    }),
  }));
