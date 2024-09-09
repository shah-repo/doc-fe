import { FormikProvider, useFormik } from 'formik';
import { isEmpty, kebabCase, omit, unionBy } from 'lodash';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../../common/intl';
import { Mode, MODE_FIELD } from '../../../../../components/KendoDataGrid/constants';
import SettingsPanel from '../../../components/SettingsPanel';
import SettingsTable from '../../../components/SettingsTable';
import { SettingsPanelProps } from '../../../types';
import { buildSchema } from './schema';
import { EditableSupplierConfig, SupplierConfig, SupplierTypes } from './types';

const SupplierConfiguration: React.FC<SettingsPanelProps> = (props) => {
  // const { submitForm: submitSettingsForm } = useFormikContext<GeneralSettings>();
  const isActive = true; // useSelector(getHasPermission(Permission.EDIT_SUPPLIER_STATUS));
  // const fetchLCPPhases = useActionCreator(companyActions.fetchLCPPhasesByGroup);
  const supplierConfigurationSampleData = [
    { id: '1', supplierType: [{ id: '12', text: SupplierTypes.ConsultantContractors }], supplierCapabilities: [{ id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }], supplierServices: [{ id: '12', text: 'Approved' }] },
    { id: '2', supplierType: [{ id: '12', text: SupplierTypes.ConsultantContractors }], supplierCapabilities: [{ id: '12', text: 'Approved' }], supplierServices: [{ id: '12', text: 'Approved' }] },
    { id: '3', supplierType: [{ id: '12', text: SupplierTypes.ConsultantContractors }], supplierCapabilities: [{ id: '12', text: 'Approved' }], supplierServices: [{ id: '12', text: 'Approved' }] },
    { id: '4', supplierType: [{ id: '12', text: SupplierTypes.ConsultantContractors }], supplierCapabilities: [{ id: '12', text: 'Approved' }], supplierServices: [{ id: '12', text: 'Approved' }] },
  ];

  const [supplierConfiguration, setSupplierConfiguration] = React.useState<SupplierConfig[]>(supplierConfigurationSampleData);
  const [editedSupplierConfiguration, setEditedSupplierConfiguration] = React.useState<EditableSupplierConfig>();

  const discardSupplierConfiguration = () => setEditedSupplierConfiguration(undefined);
  // const changeCompanyAction = useActionCreator(companyActions.updateCompanyMine);

  // const async = useAsync({
  //   onSuccess: submitSettingsForm,
  //   onError: (error) => {
  //     setSupplierConfiguration(supplierConfiguration);
  //     toastError(error);
  //   },
  // });

  const updateLocations = (updatedLocations: SupplierConfig[]) => {
    setSupplierConfiguration(updatedLocations);
    // async.start(changeCompanyAction, { locations: updatedLocations }, async);
  };

  const formik = useFormik<EditableSupplierConfig | Record<string, never>>({
    initialValues: {},
    validate: (values) => {
      const error: Record<string, string> = {};
      if (isEmpty(values.supplierType)) {
        error.name = 'validators.required';
      }
      return error;
    },
    onSubmit: (values) => {
      const updatedLocations = unionBy([omit(values, MODE_FIELD)], supplierConfiguration, 'id');
      discardSupplierConfiguration();
      updateLocations(updatedLocations);
    },
  });
  const { setValues, submitForm } = formik;

  const changeLocationActiveState = (location: EditableSupplierConfig, state: boolean) => {
    const updatedLocations = supplierConfiguration.map(it => it.id === location.id ? { ...it, active: state } : it);
    updateLocations(updatedLocations);
  };

  useEffect(() => {
    setValues(editedSupplierConfiguration ?? {});
  }, [editedSupplierConfiguration, setValues]);

  // useEffect(() => {
  //   setSupplierConfiguration(locations);
  // }, [locations]);

  const addSupplierConfig = () => {
    setEditedSupplierConfiguration({
      id: uuidv4(),
      supplierType: [],
      supplierCapabilities: [],
      supplierServices: [],
      [MODE_FIELD]: Mode.add,
    });
  };

  const mappedLocations = supplierConfiguration?.map((location) => {
    return {
      ...location,
      [MODE_FIELD]: location.id === editedSupplierConfiguration?.id ? Mode.edit : Mode.show,
    };
  }) ?? [];

  const locationsList
    = editedSupplierConfiguration?.[MODE_FIELD] === Mode.add
      ? [...mappedLocations, editedSupplierConfiguration]
      : mappedLocations;

  const dataCyGenerator = (SupplierConfig: EditableSupplierConfig) => ({
    'data-cy': `row-${kebabCase(SupplierConfig.supplierType[0]?.id)}`,
  });

  const schema = buildSchema({
    isActive,
    onEdit: isActive ? setEditedSupplierConfiguration : undefined,
    onActiveStateChange: isActive ? changeLocationActiveState : undefined,
    onDiscard: discardSupplierConfiguration,
    onConfirm: submitForm,
  });

  return (
    <SettingsPanel
      {...props}
      title={translate(props.title)}
      onAddNew={isActive ? addSupplierConfig : undefined}
    >
      <FormikProvider value={formik}>
        <SettingsTable
          isActive={isActive}
          data={locationsList}
          isEditing={editedSupplierConfiguration !== undefined}
          schema={schema}
          addButtonLabel={translate('common.add.new')}
          onAdd={addSupplierConfig}
          getRowProperties={dataCyGenerator}
        />
      </FormikProvider>
    </SettingsPanel>
  );
};
export default SupplierConfiguration;
