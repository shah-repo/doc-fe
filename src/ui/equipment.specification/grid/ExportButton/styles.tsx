import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../ui/layout/theme-next';

const styles = makeStyles((theme) => ({
  exportListbutton: {
    margin: 0,
    boxShadow: 'none',
    borderRadius: 100,
    textTransform: 'capitalize',
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    color: Colors.primary,
    border: `1px solid ${Colors.primary}`,
    backgroundColor: Colors.white,
  },
}
));

export default styles;
