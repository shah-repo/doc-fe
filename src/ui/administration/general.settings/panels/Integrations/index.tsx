import { List, ListItem } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../../common/intl';
import SettingsPanel from '../../components/SettingsPanel';
import { SettingsPanelProps } from '../../types';
import HelloSignIntergrationItem from './HelloSignIntegration';
import SlackIntergrationItem from './SlackIntegration';

const INTEGRATIONS = [
  SlackIntergrationItem,
  HelloSignIntergrationItem,
];

const IntegrationsSettingsPanel: React.FC<SettingsPanelProps> = ({
  onToggle,
  ...props
}) => {
  const availibleIntergrations = INTEGRATIONS.map(Integration => <Integration />).filter(el => el.type() !== null);

  const isIntegrationsAvailable = availibleIntergrations.length > 0;

  return (
    <SettingsPanel {...props} onToggle={onToggle} title={translate('integrations.title')}>
      {isIntegrationsAvailable ? (
        <List>
          {availibleIntergrations.map((intergration, index) => (
            <ListItem disableGutters divider={index < availibleIntergrations.length - 1} alignItems="center">
              {intergration}
            </ListItem>
          ))}
        </List>
      ) : translate('integrations.not.available')}
    </SettingsPanel>
  );
};

export default IntegrationsSettingsPanel;
