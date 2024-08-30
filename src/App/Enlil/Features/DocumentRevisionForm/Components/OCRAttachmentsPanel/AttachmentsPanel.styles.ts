import { makeStyles } from '@material-ui/core';
import Colors from '../../../../../../ui/layout/theme/utils/colors';

const DRAWER_WIDTH = 285;

export default makeStyles({
  root: {
    zIndex: 1202,
    height: '100%',
    backgroundColor: Colors.white,
    display: 'flex',
    flexDirection: 'row',
  },
  pannel: {
    width: DRAWER_WIDTH,
    boxShadow: `inset -1px 0px 0px ${Colors.lightest_grey1}`,
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
    width: 500,
    border: `1px solid ${Colors.gray_goose}`,
  },
  previewContainer: {
    borderTop: `1px solid ${Colors.gray_goose}`,
  },
  hidePreviewButton: {
    padding: 0,
    minHeight: '15px',
  },
});
