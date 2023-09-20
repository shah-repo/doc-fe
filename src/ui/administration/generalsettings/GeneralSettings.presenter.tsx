import { Box, Divider, Grid, Tab, Tabs } from '@material-ui/core';
import React from 'react';
import KendoGridStyles from '../../components/KendoGrid/KendoGrid.styles';
import Text from '../../components/Text';
import { FBButton, FBLabel } from '../../form.builder';
import { Colors } from '../../layout/theme-next';
import { GeneralSettingsProps, GeneralSettingsTabs } from './GeneralSettings.types';
import PrintingContainer from './printing/Printing.container';

const GeneralSettingsPresenter: React.FunctionComponent<GeneralSettingsProps> = ({
  generalSettingsState,
  onSaveChanges,
  handleTabChange,
  tabValue,
}) => {
  const classes = KendoGridStyles();

  return (
    <Grid container >
      <Grid container xs={12} className={classes.headerGridItem}>
        <Grid item xs={8} >
          <FBLabel label={{
            locale: 'administration.generalsettings.title',
          }}
            fontSize={21} />
          <Text translation="administration.generalsettings.sub.title" />
        </Grid>
        <Grid item xs={4} style={{ display: 'flex', justifyContent: 'end' }}>
          <FBButton
            label="common.save.changes"
            variant="contained"
            onClick={onSaveChanges} />
        </Grid>
      </Grid>
      <Grid item lg={12} >
        <Divider style={{ margin: '0px 32px 0px 28px' }} />
        <Box
          padding={4}
          display="flex"
          flexGrow={1}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={tabValue}
            onChange={handleTabChange}
          >
            <Tab
              value={GeneralSettingsTabs.Printing}
              label={GeneralSettingsTabs.Printing}
              style={{ backgroundColor: Colors.primaryBg, textTransform: 'none' }} />
          </Tabs>
          {tabValue === GeneralSettingsTabs.Printing && <PrintingContainer generalSettingsState={generalSettingsState} />}
        </Box>
      </Grid>
    </Grid>
  );
};

export default GeneralSettingsPresenter;
