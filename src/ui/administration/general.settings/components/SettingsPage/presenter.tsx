import { Box, LinearProgress, MenuItem, MenuList, Typography } from '@material-ui/core';
import { kebabCase, remove } from 'lodash';
import React, { useState } from 'react';
import { translate } from '../../../../../common/intl';
import { Button } from '../../../../components/forms/fields-next';
import { withThemeNext } from '../../../../layout/theme-next';
import { panels } from '../../constants';
import { GeneralSettingsProps, GeneralSettingsTabs } from '../../types';
import HeaderLastSaved from '../HeaderLastSaved';
import useStyles from './styles';

const GeneralSettingsPage: React.FC<GeneralSettingsProps> = ({
  updatedAt,
  isLoading,
  onSave,
}) => {
  const classes = useStyles();

  const [expandedPanels, setExpanedPanels] = useState<GeneralSettingsTabs[]>([]);
  const allPanelsExpaned = expandedPanels.length === panels.length;

  const toggleAllPanels = () => setExpanedPanels(allPanelsExpaned ? [] : panels.map(panel => panel.key));
  const togglePanel = (key: GeneralSettingsTabs) => () => setExpanedPanels(state => (
    state.includes(key) ? remove(state, key) : [...state, key]
  ));
  const jumpToPanel = (key: GeneralSettingsTabs) => () => setExpanedPanels([key]);

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Box>
          <Typography
            variant="h1"
            className={classes.title}
          >
            {translate('administration.general.settings.title')}
          </Typography>
          <Typography
            variant="subtitle1"
            className={classes.subtitle}
          >
            {translate('administration.general.settings.subtitle')}
          </Typography>
          <br className={classes.spaceTitle} />
        </Box>
        <Box className={classes.actions}>
          {updatedAt && (
            <HeaderLastSaved
              timestamp={updatedAt}
              loading={isLoading}
            />
          )}
          <Box className={classes.buttons}>
            <Button kind="outlined" data-cy="settings-history" disabled>{translate('common.history')}</Button>
            <Button onClick={onSave} data-cy="settings-save">{translate('common.save.changes')}</Button>
          </Box>
        </Box>
        {isLoading && <LinearProgress className={classes.progress} data-cy="saving-progress-bar" />}
      </Box>
      <Box className={classes.sidebar}>
        <MenuList>
          {panels.map(panel => (
            <MenuItem
              key={panel.key}
              className={classes.listItem}
              onClick={jumpToPanel(panel.key)}
              selected={expandedPanels.includes(panel.key)}
              data-cy={`link-${kebabCase(panel.title)}`}
            >
              {translate(panel.title)}
            </MenuItem>
          ))}
        </MenuList>
      </Box>
      <Box className={classes.toggler}>
        <Button kind="ghost" onClick={toggleAllPanels}>
          {translate(allPanelsExpaned ? 'common.collapse.all' : 'common.expand.all')}
        </Button>
      </Box>
      <Box className={classes.panels}>
        {panels.map(panel => (
          <panel.component
            key={panel.key}
            title={panel.title}
            expanded={expandedPanels.includes(panel.key)}
            onToggle={togglePanel(panel.key)}
            data-cy={kebabCase(panel.title)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default withThemeNext(GeneralSettingsPage);
