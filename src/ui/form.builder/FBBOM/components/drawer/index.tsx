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
import LaunchIcon from '@material-ui/icons/Launch';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { FormHeaderStatusClassMapping } from '../../../../components/common/header/Helpers';
import Text from '../../../../components/Text';
import { Colors } from '../../../../layout/theme-next';
import FBBOMDrawerTable from '../drawerTable';
import useStyles from './styles';

interface FBBOMDetailDrawerProps {
  openDrawer: boolean
  closeDrawer: () => void
}

const FBBOMDetailDrawer: React.FunctionComponent<FBBOMDetailDrawerProps> = ({
  openDrawer,
  closeDrawer,
  children,
}) => {
  const classes = useStyles();
  return (
    <Drawer anchor="right" open={openDrawer} onClose={closeDrawer} BackdropProps={{ invisible: true }}>
      {children ?? <Box margin="30px">
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
              {translate('bom.table.title.alternate.parts.list')}
            </Typography>
          </Grid>
          <Grid item>
            <div className={classes.iconContainer}>
              <IconButton
                onClick={() => closeDrawer()}
                className={classes.iconButton}
                size="small"
                data-cy=""
              >
                <LaunchIcon className={classes.launchIcon} />
              </IconButton>
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
              CS-00007
            </Typography>
          </Grid>
          <Grid item className={classes.whiteDot} />
          <Grid item className={classes.docId}>
            <Text
              translation="form.builder.header.rev"
              values={{ revision: 1 }}
              dataCy="HeaderInfo-Rev"
            />
          </Grid>
          <Grid item className={classes.chipContainer}>
            <Chip
              size="small"
              className={`${classes.chip} ${
                classes[FormHeaderStatusClassMapping.Released]
              }`}
              label="Released"
              data-cy="HeaderInfo-status"
            />
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <FBBOMDrawerTable />
      </Box>}
    </Drawer>
  );
};

export default FBBOMDetailDrawer;
