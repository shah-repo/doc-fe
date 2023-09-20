import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { RouteParams } from '../../documentType/utils/types';
import { FB } from '../../form.builder';
import GeneralSettingsPresenter from './GeneralSettings.presenter';
import GeneralSettingsState from './GeneralSettings.state';
import { GeneralSettingsTabs } from './GeneralSettings.types';

const GeneralSettingsContainer: React.FunctionComponent<RouteComponentProps<RouteParams>> = ({
  match
}) => {
  const generalSettingsState = FB.useRef<GeneralSettingsState>(GeneralSettingsState, {});
  const [value, setValue] = React.useState(GeneralSettingsTabs.Printing);

  const onSaveChanges = () => {
    generalSettingsState.savePrinterData();
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, value: any) => {
    setValue(value);
  };

  return (
    <GeneralSettingsPresenter
      {... { handleTabChange }}
      generalSettingsState={generalSettingsState}
      onSaveChanges={onSaveChanges}
      tabValue={value} />
  );
};

export default GeneralSettingsContainer;
