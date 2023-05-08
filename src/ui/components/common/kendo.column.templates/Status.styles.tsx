import { makeStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export const styles = makeStyles((theme) => ({
  chip: {
    display: 'flex',
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
  },
  GREEN_STATUS: {
    background: Colors.carla,
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
}));
