import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../../../../../ui/layout/theme-next';

const DRAWER_WIDTH = 285;
const DOC_PREVIEW_WIDTH = 500;

export default makeStyles((theme) =>
  createStyles({
    root: {
      zIndex: 1202,
      height: '100%',
      backgroundColor: Colors.white,
      display: 'flex',
      flexDirection: 'row',
    },
    panel: {
      width: DRAWER_WIDTH,
      boxShadow: `inset -1px 0px 0px ${Colors.lightGray3}`,
    },
    iconButtonNew: {
      cursor: 'pointer',
      color: Colors.primary,
      marginRight: theme.spacing(1),
    },
    titleText: {
      fontWeight: 600,
      fontSize: 12,
      color: Colors.textBlack,
    },
    titleDescText: {
      fontWeight: 400,
      fontSize: 12,
      color: Colors.textGray,
    },
    docPreview: {
      width: DOC_PREVIEW_WIDTH,
      border: `1px solid ${Colors.lightGray3}`,
    },
    docPreviewExtended: {
      width: DOC_PREVIEW_WIDTH + DRAWER_WIDTH,
      border: `1px solid ${Colors.lightGray3}`,
    },
    previewContainer: {
      borderTop: `1px solid ${Colors.lightGray3}`,
    },
    hidePreviewButton: {
      padding: 0,
      minHeight: 15,
    },
    panelTitle: {
      alignItems: 'center',
      paddingLeft: theme.spacing(3.125),
      marginTop: theme.spacing(1.25),
      height: 45,
    },
    panelButton: {
      paddingX: theme.spacing(1.875),
      paddingTop: theme.spacing(2.5),
    },
    panelPreview: {
      height: 40,
      padding: theme.spacing(1.5, 1.875),
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
    },
    panelPreviewTitle: {
      display: 'flex',
      alignItems: 'center',
    },
  }),
);
