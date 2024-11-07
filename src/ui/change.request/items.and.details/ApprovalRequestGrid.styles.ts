import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';
import LegacyColors from '../../layout/theme/utils/colors';

const MIN_COLUMN_WIDTH = 160;

export default makeStyles((theme) =>
  createStyles({
    tableContainer: {
      border: `1px solid ${Colors.tableStroke}`,
      borderRadius: theme.spacing(0.5),
      overflowY: 'auto',
      backgroundColor: Colors.white,
    },
    table: {
      display: 'grid',
      gridTemplateColumns: `
        max-content
        max-content
        minmax(${MIN_COLUMN_WIDTH}px, 4fr)
        minmax(${MIN_COLUMN_WIDTH}px, 5fr)
        minmax(${MIN_COLUMN_WIDTH}px, 5fr)
        48px
      `,
    },
    tableWithSubstitution: {
      gridTemplateColumns: `
        48px
        max-content
        max-content
        minmax(${MIN_COLUMN_WIDTH}px, 4fr)
        minmax(${MIN_COLUMN_WIDTH}px, 5fr)
        minmax(${MIN_COLUMN_WIDTH}px, 5fr)
        48px
      `,
    },
    title: {
      color: Colors.textBlack,
    },
    tableHeader: {
      gridColumn: '1 / -1',
      minHeight: 40,
      display: 'grid',
      gridTemplateColumns: 'subgrid',
      alignItems: 'center',
      backgroundColor: Colors.primaryBg,
      color: Colors.textBlack,
      borderBottom: 'none',
      fontSize: 12,
      lineHeight: 1.15,
      fontWeight: 600,
    },
    headerCell: {
      padding: theme.spacing(1, 1.25),
      position: 'relative',

      '&:before': {
        content: '""',
        position: 'absolute',
        width: 1,
        height: 24,
        backgroundColor: Colors.tableStroke,
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
      },

      '&:first-child:before': {
        display: 'none',
      },
    },
    tableContent: {
      display: 'grid',
      alignItems: 'center',
      gridTemplateColumns: 'subgrid',
      gridColumn: '1 / -1',
    },
    contentCell: {
      padding: theme.spacing(1.5, 1.25),
      overflow: 'hidden',
    },
    contentSubCell: {
      padding: theme.spacing(0.5, 1.25),
      overflow: 'hidden',
    },
    contentRow: {
      display: 'grid',
      alignItems: 'center',
      gridTemplateColumns: 'subgrid',
      gridColumn: '1 / -1',
      minHeight: 60,
    },
    editedContentRow: {
      outline: `1px solid ${Colors.primaryLight}`,
      outlineOffset: -1,
      position: 'relative',
    },
    contentSubRow: {
      minHeight: 0,
    },
    enclosingDiv: {
      gridColumn: '1 / -1',
      color: Colors.textBlack,
      position: 'relative',
      flexWrap: 'wrap',
      backgroundColor: Colors.white,
      borderBottom: `1px solid ${Colors.tableStroke}`,
      display: 'grid',
      gridTemplateColumns: 'subgrid',

      '&:last-child': {
        borderRadius: theme.spacing(0, 0, 0.625, 0.625),
        borderBottom: 'none',
      },
    },
    enclosingDivViewItem: {
      cursor: 'pointer',

      '&:hover': {
        backgroundColor: Colors.hover,

        '& $expandIcon': {
          backgroundColor: Colors.white,
        },
      },
    },
    moreDetails: {
      display: 'grid',
      gridColumn: '1 / -1',
      gridTemplateColumns: 'subgrid',
      padding: theme.spacing(0, 0, 1.5),
    },
    moreDetailsHeader: {
      gridColumn: '1 / -1',
      borderTop: `1px solid ${Colors.tableStroke}`,
      padding: theme.spacing(1.5, 0, 0.75, 1.25),
      margin: 0,
      color: Colors.textGray,
      fontSize: 12,
      fontWeight: 500,
    },
    moreDetailsHeaderSubstituted: {
      padding: theme.spacing(1.5, 0, 0.75, 7.25),
    },
    link: {
      textDecoration: 'none',
      color: Colors.primary,

      '&:visited': {
        color: Colors.primaryDark,
      },
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    autoUpdateCell: {
      textAlign: 'center',

      '& label': {
        margin: 0,
      },
    },
    itemCell: {
      display: 'flex',
      alignItems: 'center',
      columnGap: theme.spacing(0.75),
      whiteSpace: 'nowrap',

      '& > .MuiBox-root': {
        width: '100%',
      },
    },
    expandIcon: {
      width: 20,
      minHeight: 20,
      height: 20,
    },
    expandIconExpanded: {
      color: Colors.primary,
      transform: 'rotate(90deg)',
    },
    textCell: {
      '& .MuiOutlinedInput-multiline': {
        padding: theme.spacing(1.25, 1.75),
      },
    },
    textCellEditing: {
      padding: theme.spacing(0.625, 0.25),
    },
    whereUsedCell: {
      textAlign: 'center',
    },
    whereUsedIcon: {
      height: 10,
      width: 10,
    },
    iconDisabled: {
      opacity: 0.5,
    },
    subItemCellSubstituted: {
      gridColumnStart: 2,
    },
    subObsoleteCell: {
      gridColumnEnd: 'span 4',
    },
    obsoleteIcon: {
      color: Colors.primaryLight,
    },
    tooltipContent: {
      maxWidth: 425,
      maxHeight: 200,
      overflow: 'auto',
      whiteSpace: 'pre-line',
      paddingRight: theme.spacing(0.5),
      marginRight: theme.spacing(-0.5),
    },
    popper: {
      zIndex: theme.zIndex.tooltip,
      marginTop: -1,
    },
    attachmentsDialogContainer: {
      marginTop: theme.spacing(-4),
    },
    attachmentsList: {
      gap: theme.spacing(1, 1),
      fontSize: 12,
      color: Colors.primary,
    },
    allAttachments: {
      color: Colors.primary,
      display: 'inline-block',
      fontSize: 12,
      fontWeight: 400,
      textDecoration: 'underline',
      margin: theme.spacing(1, 0, 0),
    },
    autocompleteOption: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      display: 'block',
    },
    tabContent: {
      width: '100%',
      position: 'relative',
      marginBottom: theme.spacing(6),
      opacity: 1,
      transition: 'opacity .2s ease-in',
    },
    tabContentInactive: {
      pointerEvents: 'none',
    },
    loader: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: LegacyColors.background_white,
      opacity: 0.7,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      zIndex: 1,
    },
    divider: {
      margin: theme.spacing(0, 0, 1.5, 0),
    },
  }),
);
