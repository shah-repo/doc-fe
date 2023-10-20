import { makeStyles } from '@material-ui/core';
import { lineItemStyles } from '../common/styles';
import { NextTheme } from '../../../layout/theme-next/provider';

export default makeStyles((theme: NextTheme) => ({
  ...lineItemStyles(theme),
}));
