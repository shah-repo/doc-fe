import { createStyles, makeStyles } from '@material-ui/core';
import { NextTheme } from '../../../../../../ui/layout/theme-next/provider';
import Colors from '../../../../../../ui/layout/theme/utils/colors';

const DRAWER_WIDTH = 285;
const DOC_PREVIEW_WIDTH = 500;

export default makeStyles((theme: NextTheme) =>
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
      boxShadow: `inset -1px 0px 0px ${Colors.lightest_grey1}`,
    },
    iconButtonNew: {
      cursor: 'pointer',
      color: Colors.navy,
    },
    titleText: {
      fontWeight: 600,
      fontSize: 12,
      color: Colors.dark_jungle_green,
    },
    titleDescText: {
      fontWeight: 400,
      fontSize: 12,
      color: Colors.font_gray,
    },
    docPreview: {
      width: DOC_PREVIEW_WIDTH,
      border: `1px solid ${Colors.gray_goose}`,
    },
    docPreviewExtended: {
      width: DOC_PREVIEW_WIDTH + DRAWER_WIDTH,
      border: `1px solid ${Colors.gray_goose}`,
    },
    previewContainer: {
      borderTop: `1px solid ${Colors.gray_goose}`,
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
      paddingX: theme.spacing(1.875),
      paddingY: theme.spacing(1.5),
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
    },
  }),
);
