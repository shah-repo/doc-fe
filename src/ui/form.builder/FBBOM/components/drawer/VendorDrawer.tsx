import {
  Box,
  Chip,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { FormHeaderStatusClassMapping } from '../../../../components/common/header/Helpers';
import Text from '../../../../components/Text';
import { Colors } from '../../../../layout/theme-next';
import { Vendor } from '../../../FBPartVendors/types';
import PartVendorsTable from '../drawerTable/vendors';
import useStyles from './styles';

interface VendorTableProps {
  openDrawer: boolean
  closeDrawer: () => void
  parentRevId?: string
  docId?: string
  status?: string
  revision?: string
  vendors: Vendor[]
}

const FBBOMDetailDrawer: React.FunctionComponent<VendorTableProps> = ({
  openDrawer,
  closeDrawer,
  parentRevId,
  docId,
  status,
  revision,
  children,
  vendors,
}) => {
  const classes = useStyles();
  return (
    <Drawer anchor="right" open={openDrawer} onClose={closeDrawer}>
      {children ?? (
        <Box className={classes.drawer}>
          <Grid
            container={true}
            wrap="nowrap"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography
                className={classes.headerInfo}
                data-cy="HeaderInfo-docId"
                component="span"
              >
                {translate('bom.table.title.alternate.suppliers.list')}
              </Typography>
            </Grid>
            <Grid item>
              <div className={classes.iconContainer}>
                <IconButton
                  onClick={() => closeDrawer()}
                  aria-label="Close"
                  disableFocusRipple
                  disableRipple
                  disableTouchRipple
                  data-cy="close-alternate-part-list"
                  className={classes.closeIcon}
                >
                  <CloseIcon style={{ color: Colors.light_gray }} />
                </IconButton>
              </div>
            </Grid>
          </Grid>
          <Grid
            container
            wrap="nowrap"
            justify="flex-start"
            alignItems="center"
            className={classes.partInfo}
          >
            <Grid item>
              <Typography
                className={classes.docId}
                data-cy="HeaderInfo-docId"
                component="span"
              >
                {docId}
              </Typography>
            </Grid>
            <Grid item className={classes.whiteDot} />
            <Grid item className={classes.docId}>
              <Text
                translation="form.builder.header.rev"
                values={{ revision }}
                dataCy="HeaderInfo-Rev"
              />
            </Grid>
            <Grid item className={classes.chipContainer}>
              <Chip
                size="small"
                className={`${classes.chip} ${
                  classes[FormHeaderStatusClassMapping[status ?? '']]
                }`}
                label={status}
                data-cy="HeaderInfo-status"
              />
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <PartVendorsTable vendors={vendors} />
        </Box>
      )}
    </Drawer>
  );
};

export default FBBOMDetailDrawer;
