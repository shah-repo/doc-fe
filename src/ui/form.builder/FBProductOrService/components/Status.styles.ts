import { makeStyles } from '@material-ui/core';
import { ASLStatusChipStyles } from '../../../administration/general.settings/panels/SupplierSettings/ASLStatus/components/ASLTypeCell.styles';

export default makeStyles((theme) => ({
  ...ASLStatusChipStyles(theme),
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
}));
