import { Box, Chip, Drawer, Grid, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import LaunchIcon from '@material-ui/icons/Launch';
import React from 'react';
import { FormHeaderStatusClassMapping } from '../../../../components/common/header/Helpers';
import Text from '../../../../components/Text';
import { Colors } from '../../../../layout/theme-next';
import FBBOMDrawerTable from '../drawerTable';
import useStyles from './styles';

interface FBBOMDetailDrawerProps {
  openDrawer: boolean
  closeDrawer: () => void
}

const FBBOMDetailDrawer: React.FunctionComponent<FBBOMDetailDrawerProps> = ({ openDrawer, closeDrawer }) => {
  const classes = useStyles();
  return (
    <div>
      <Drawer anchor="right" open={openDrawer} onClose={closeDrawer}>
        <Box margin="30px">
          <div className={classes.titleOuterContainer}>
            <Grid
              container={true}
              wrap="nowrap"
              justify="flex-start"
              alignItems="center"
            >
              <Grid item={true}>
                <Typography className={classes.headerInfo} data-cy="HeaderInfo-docId" component="span">
            CS-00005-02
                </Typography>
              </Grid>
              <Grid item={true} className={classes.whiteDot} />
              <Grid item={true} className={classes.headerInfo}>
                <Text
                  translation="form.builder.header.rev"
                  values={{ revision: 1 }}
                  dataCy="HeaderInfo-Rev"
                />
              </Grid>
              <Grid item={true} className={classes.chipContainer} >
                <Chip
                  size="small"
                  className={`${classes.chip} ${classes[FormHeaderStatusClassMapping.Released]}`}
                  label="Released"
                  data-cy="HeaderInfo-status"
                />
              </Grid>
              <IconButton
                onClick={() => closeDrawer()}
                className={classes.iconButton}
                size="small"
                data-cy=""
              >
                <LaunchIcon className={classes.launchIcon} />
              </IconButton>
            </Grid>
            <div className={classes.iconContainer} >
              <IconButton
                style={{ width: '23px' }}
                color="default"
                onClick={() => closeDrawer()}
                aria-label="Close"
                disableFocusRipple
                disableRipple
                disableTouchRipple
                data-cy=""
              >
                <CloseIcon style={{ color: Colors.light_gray }} />
              </IconButton>
            </div>
          </div>
          <Typography data-cy="" component="div" className={classes.title}>
            Right Lens
          </Typography>
          <Typography data-cy="" component="span" className={classes.description}>
          This is the description of this part. It can include high level details of the part
          </Typography>
          <Typography className={classes.tableTitle} id="tableTitle" >
            <Text translation="form.builder.parts.bom.tableTitle" />
          </Typography>
          <FBBOMDrawerTable />
        </Box>
      </Drawer>
    </div>
  );
};

export default FBBOMDetailDrawer;
