import { useFormik, useFormikContext } from 'formik';
import { omit } from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../common/intl';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import { EquipmentLocation, GeneralSettings } from '../../../../../state/ducks/company/types';
import { DataGridRowClickEvent } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../../../components/KendoDataGrid/constants';
import Text from '../../../../components/Text';
import { toastError } from '../../../../components/notifications';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import LocationsSetting from '../../components/LocationsSetting';
import useStyles from '../../components/LocationsSetting/styles';
import { EditableLocation } from '../../components/LocationsSetting/types';
import SettingsPanel from '../../components/SettingsPanel';
import SettingsPanelSection from '../../components/SettingsPanelSection';
import SwitchControl from '../../components/SwitchControl';
import { SettingsPanelProps } from '../../types';
import { buildSchema } from './schema';

const EquipmentFamilySettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  const { getFieldProps, values: formValues } = useFormikContext<GeneralSettings>();
  const classes = useStyles();
  const locations = getFieldProps('equipmentFamily.locations').value as EquipmentLocation[];
  const fieldProps = getFieldProps('equipmentFamily.autoSyncEnabled');
  const settingsId = useSelector(companySelectors.getGeneralSettingsId);
  const onRowClick = ({ dataItem }: DataGridRowClickEvent<EditableLocation>) => setEditedLocation(dataItem);
  const discardLocation = () => setEditedLocation(undefined);
  const [locationsData, setLocationsData] = React.useState<EquipmentLocation[]>(locations);

  const async = useAsync({
    onError: (error) => {
      setLocationsData(locations);
      toastError(error);
    },
  });
  const updateEquipmentLocationAction = useActionCreator(companyActions.updateGeneralSettings);
  const [editedLocation, setEditedLocation] = React.useState<EditableLocation>();
  const formik = useFormik<EditableLocation | Record<string, never>>({
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
      setLocationsData(updatedLocations);
      formValues.equipmentFamily.locations = updatedLocations;
      discardLocation();
      async.start(updateEquipmentLocationAction, formValues, settingsId, 'PUT', async);
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

  const { setValues, submitForm } = formik;

  useEffect(() => {
    setValues(editedLocation ?? {});
  }, [editedLocation, setValues]);

  useEffect(() => {
    setLocationsData(locations);
  }, [locations]);

  const schema = buildSchema({
    isActive: true,
    actionsClass: classes.actionsCell,
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
      <LocationsSetting {...{ formik, locationsList, schema, editedLocation, addLocation, onRowClick }} />
    </SettingsPanel>
  );
};
export default EquipmentFamilySettingsPanel;
