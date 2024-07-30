import { FormikProvider, useFormik } from 'formik';
import { isEmpty, omit, unionBy } from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../common/intl';
import { getHasPermission } from '../../../../../common/utils/selectors';
import { Permission } from '../../../../../state/ducks/auth/types';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import { CompanyLocation } from '../../../../../state/ducks/company/types';
import { MODE_FIELD, Mode } from '../../../../components/KendoDataGrid/constants';
import { toastError } from '../../../../components/notifications';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import SettingsPanel from '../../components/SettingsPanel';
import SettingsTable from '../../components/SettingsTable';
import { SettingsPanelProps } from '../../types';
import { buildSchema } from './schema';
import { EditableCompanyLocation } from './types';

const CompanyLocationSettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  const companyMine = useSelector(companySelectors.getCompanyMine);
  const isActive = useSelector(getHasPermission(Permission.COMPANY_UPDATE_LOCATIONS));
  const locations = companyMine.locations;

  const [locationsData, setLocationsData] = React.useState<CompanyLocation[]>(locations);
  const [editedLocation, setEditedLocation] = React.useState<EditableCompanyLocation>();

  const discardLocation = () => setEditedLocation(undefined);
  const changeCompanyAction = useActionCreator(companyActions.updateCompanyMine);

  const async = useAsync({
    onError: (error) => {
      setLocationsData(locations);
      toastError(error);
    },
  });

  const updateLocations = (updatedLocations: CompanyLocation[]) => {
    setLocationsData(updatedLocations);
    async.start(changeCompanyAction, { locations: updatedLocations }, async);
  };

  const formik = useFormik<EditableCompanyLocation | Record<string, never>>({
    initialValues: {},
    validate: (values) => {
      const error: Record<string, string> = {};
      const isDuplicate = locations.some(({ name, id }) => name.toLowerCase() === values.name.toLowerCase() && id !== values.id);
      if (isEmpty(values.name)) {
        error.name = 'validators.required';
      }
      if (values.name && isDuplicate) {
        error.name = 'validator.location.same.name.exist';
      }
      return error;
    },
    onSubmit: (values) => {
      const updatedLocations = unionBy([omit(values, MODE_FIELD)], locations, 'id');
      discardLocation();
      updateLocations(updatedLocations);
    },
  });
  const { setValues, submitForm } = formik;

  const changeLocationActiveState = (location: EditableCompanyLocation, state: boolean) => {
    const updatedLocations = locations.map(it => it.id === location.id ? { ...it, active: state } : it);
    updateLocations(updatedLocations);
  };

  useEffect(() => {
    setValues(editedLocation ?? {});
  }, [editedLocation, setValues]);

  useEffect(() => {
    setLocationsData(locations);
  }, [locations]);

  const addLocation = () => {
    setEditedLocation({
      id: uuidv4(),
      name: '',
      includedInTotalQty: false,
      active: true,
      [MODE_FIELD]: Mode.add,
    });
    props.onToggle(true);
  };

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

  const schema = buildSchema({
    isActive,
    onEdit: isActive ? setEditedLocation : undefined,
    onActiveStateChange: isActive ? changeLocationActiveState : undefined,
    onDiscard: discardLocation,
    onConfirm: submitForm,
  });

  return (
    <SettingsPanel
      {...props}
      title={translate('administration.general.settings.locations.tab')}
      onAddNew={isActive ? addLocation : undefined}
    >
      <FormikProvider value={formik}>
        <SettingsTable
          isActive={isActive}
          data={locationsList}
          isEditing={editedLocation !== undefined}
          schema={schema}
          addButtonLabel={translate('settings.locations.add')}
          onAdd={addLocation}
        />
      </FormikProvider>
    </SettingsPanel>
  );
};
export default CompanyLocationSettingsPanel;
