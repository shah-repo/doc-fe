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
import cx from 'classnames';
import React from 'react';
import { translate } from '../../../../../common/intl';
import Text from '../../../../components/Text';
import { FormHeaderStatusClassMapping } from '../../../../components/common/header/Helpers';
import { Vendor } from '../../../FBPartVendors/types';
import PartVendorsTable from '../drawerTable/vendors';
import useStyles from './styles';
import { DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';

interface VendorTableProps {
  isDrawerOpened: boolean
  closeDrawer: () => void
  parentRevId?: string
  docId?: string
  status?: DocumentRevisionStatus
  revision?: string
  vendors: Vendor[]
}

const FBBOMDetailDrawer: React.FunctionComponent<VendorTableProps> = ({
  isDrawerOpened,
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
    <Drawer anchor="right" open={isDrawerOpened} onClose={closeDrawer}>
      {children ?? (
        <Box className={classes.drawerDiv}>
          <Grid
            container
            wrap="nowrap"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography
                className={classes.headerInfo}
                data-cy="header-info-parts"
                component="span"
              >
                {translate('bom.table.title.alternate.suppliers.list')}
              </Typography>
            </Grid>
            <Grid item>
              <div className={classes.iconContainer}>
                <IconButton
                  onClick={closeDrawer}
                  aria-label="Close"
                  disableFocusRipple
                  disableRipple
                  disableTouchRipple
                  data-cy="close-alternate-part-list"
                  className={classes.closeIcon}
                >
                  <CloseIcon />
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
                data-cy="header-info-docId"
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
                dataCy="header-info-rev"
              />
            </Grid>
            <Grid item className={classes.chipContainer}>
              <Chip
                size="small"
                className={cx(
                  classes.chip,
                  classes[FormHeaderStatusClassMapping[status ?? '']],
                )}
                label={status}
                data-cy="header-info-status"
              />
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <PartVendorsTable parentNodeRevId={parentRevId} />
        </Box>
      )}
    </Drawer>
  );
};

export default FBBOMDetailDrawer;
