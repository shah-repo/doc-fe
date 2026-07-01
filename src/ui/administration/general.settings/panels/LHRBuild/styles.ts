import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export const useStyles = makeStyles((theme) =>
  createStyles({
    supplierGrid: {
      '& .k-grid-header': {
        position: 'sticky',
        zIndex: 3,
      },
      '& .k-grid-header-locked': {
        position: 'sticky',
        top: 0,
        zIndex: 4,
      },
      '& .k-grid-header-wrap': {
        overflow: 'hidden',
      },
      '& .k-header': {
        whiteSpace: 'normal',
        lineHeight: 1.2,
      },
    },
    header: {
      whiteSpace: 'normal',
      overflow: 'visible',
      fontSize: 12,
      fontWeight: 600,
      lineHeight: '1.2',
      '& .k-link': {
        overflow: 'visible',
        whiteSpace: 'normal',
      },
      '& .k-column-title': {
        overflow: 'visible',
        textOverflow: 'unset',
        whiteSpace: 'normal',
      },
    },
    tooltipContent: {
      whiteSpace: 'pre-line',
    },
    headerButton: {
      marginRight: theme.spacing(0.675),
      color: Colors.primary,
    },
  }),
);
