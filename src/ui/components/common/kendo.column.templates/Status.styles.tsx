import { makeStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export default makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  chip: {
    display: 'inline-flex',
    flexDirection: 'row',
    borderRadius: 3,
    border: `1px solid ${Colors.steel_blue}`,
    background: Colors.light_cyan,
    fontWeight: 600,
    fontSize: 10,
    lineHeight: 1.3,
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.lochmara,
    cursor: 'pointer',
    marginRight: theme.spacing(0.5),
  },
  GREEN_STATUS: {
    background: Colors.snow_flurry,
    color: Colors.light_forest_green,
    border: `1px solid ${Colors.light_forest_green_border}`,
  },
  PENDING_STATUS: {
    background: Colors.old_lace,
    color: Colors.tawny,
    border: `1px solid ${Colors.ochre}`,
  },
  GRAY_STATUS: {
    background: Colors.lily_white,
    color: Colors.font_gray,
    border: `1px solid ${Colors.font_gray}`,
  },
  RED_STATUS: {
    background: Colors.errorHighlight,
    color: Colors.latest_red_varient,
    border: `1px solid ${Colors.latest_red_varient}`,
  },
  statusIcon: {
    height: 7,
    width: 7,
    marginRight: theme.spacing(1),
    borderRadius: '50%',
  },
  Active: {
    backgroundColor: Colors.green,
  },
  Inactive: {
    backgroundColor: Colors.font_gray,
  },
}));
