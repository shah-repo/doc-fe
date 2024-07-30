import { FormikProvider, useFormik, useFormikContext } from 'formik';
import { kebabCase, omit } from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../common/intl';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import { EquipmentLocation, GeneralSettings } from '../../../../../state/ducks/company/types';
import { MODE_FIELD, Mode } from '../../../../components/KendoDataGrid/constants';
import Text from '../../../../components/Text';
import { toastError } from '../../../../components/notifications';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import SettingsPanel from '../../components/SettingsPanel';
import SettingsPanelSection from '../../components/SettingsPanelSection';
import SettingsTable from '../../components/SettingsTable';
import SwitchControl from '../../components/SwitchControl';
import { SettingsPanelProps } from '../../types';
import { buildSchema } from './schema';
import { EditableEquipmentLocation } from './types';

const EquipmentFamilySettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, values: formValues } = useFormikContext<GeneralSettings>();
  const locations = getFieldProps<EquipmentLocation[]>('equipmentFamily.locations').value;
  const fieldProps = getFieldProps<boolean>('equipmentFamily.autoSyncEnabled');
  const settingsId = useSelector(companySelectors.getGeneralSettingsId);
  const [locationsData, setLocationsData] = React.useState<EquipmentLocation[]>(locations);
  const [editedLocation, setEditedLocation] = React.useState<EditableEquipmentLocation>();

  const discardLocation = () => setEditedLocation(undefined);

  const async = useAsync({
    onError: (error) => {
      setLocationsData(locations);
      toastError(error);
    },
  });
  const updateEquipmentLocationAction = useActionCreator(companyActions.updateGeneralSettings);

  const updateLocations = (updatedLocations: EquipmentLocation[]) => {
    formValues.equipmentFamily.locations = updatedLocations;
    setLocationsData(updatedLocations);
    async.start(updateEquipmentLocationAction, formValues, settingsId, 'PUT', async);
  };

  const formik = useFormik<EditableEquipmentLocation | Record<string, never>>({
    initialValues: {},
    validate: (values) => {
      const error: Record<string, string> = {};
      const isDuplicate = locations.some(({ name, id }) => name.toLowerCase() === values.name.toLowerCase() && id !== values.id);
      if (values.name && isDuplicate) {
        error.name = 'validator.location.same.name.exist';
      }
      return error;
    },
    onSubmit: (values) => {
      const isAdding = values[MODE_FIELD] === Mode.add;
      const updatedLocations = isAdding
        ? [...locations, omit(values, MODE_FIELD)] // add
        : locations.map(item => item.id === values.id ? { ...item, ...omit(values, MODE_FIELD) } : item); // edit
      discardLocation();
      updateLocations(updatedLocations);
    },
  });

  const addLocation = () => {
    setEditedLocation({
      id: uuidv4(),
      name: '',
      active: true,
      [MODE_FIELD]: Mode.add,
    });
  };

  const changeLocationActiveState = (location: EditableEquipmentLocation, state: boolean) => {
    const updatedLocations = locations.map(item => item.id === location.id ? { ...item, active: state } : item);
    updateLocations(updatedLocations);
  };

  const { setValues, submitForm } = formik;

  useEffect(() => {
    setValues(editedLocation ?? {});
  }, [editedLocation, setValues]);

  useEffect(() => {
    setLocationsData(locations);
  }, [locations]);

  const schema = buildSchema({
    isActive: true,
    onEdit: setEditedLocation,
    onActiveStateChange: changeLocationActiveState,
    onDiscard: discardLocation,
    onConfirm: submitForm,
  });

  const mappedLocations = locationsData?.map((location) => {
    return {
      ...location,
      [MODE_FIELD]: location.id === editedLocation?.id ? Mode.edit : Mode.show,
    };
  }) ?? [];

  const locationsList
    = editedLocation?.[MODE_FIELD] === Mode.add
      ? [...mappedLocations, editedLocation]
      : mappedLocations;

  const dataCyGenerator = (location: EditableEquipmentLocation) => ({
    'data-cy': `row-${kebabCase(location.name)}`,
  });

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.equipmentFamily.tab')}>
      <SettingsPanelSection>
        <Text message="administration.general.settings.equipmentFamily.es" />
      </SettingsPanelSection>
      <SwitchControl
        {...fieldProps}
        checked={fieldProps.value}
        label={translate('administration.general.settings.equipmentFamily.es.autoSync')}
      />
      <SettingsPanelSection>
        <Text message="administration.general.settings.equipmentFamily.locations" />
      </SettingsPanelSection>
      <FormikProvider value={formik}>
        <SettingsTable
          isActive
          data={locationsList}
          isEditing={editedLocation !== undefined}
          schema={schema}
          addButtonLabel={translate('settings.locations.add')}
          onAdd={addLocation}
          getRowProperties={dataCyGenerator}
        />
      </FormikProvider>
    </SettingsPanel>
  );
};
export default EquipmentFamilySettingsPanel;
