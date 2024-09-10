import { FormikProvider, useFormik } from 'formik';
import { isEmpty, kebabCase, omit, unionBy } from 'lodash';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../../common/intl';
import { companyActions } from '../../../../../../state/ducks/company';
import { Mode, MODE_FIELD } from '../../../../../components/KendoDataGrid/constants';
import { toastError } from '../../../../../components/notifications';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import SettingsPanel from '../../../components/SettingsPanel';
import SettingsTable from '../../../components/SettingsTable';
import { SettingsPanelProps } from '../../../types';
import { buildSchema } from './schema';
import { EditableSupplierConfig, OptionType, SupplierConfig, SUPPLIER_FIELDS } from './types';

const SupplierConfiguration: React.FC<SettingsPanelProps> = (props) => {
  // const { submitForm: submitSettingsForm } = useFormikContext<GeneralSettings>();
  const isActive = true; // useSelector(getHasPermission(Permission.EDIT_SUPPLIER_STATUS));
  const fetchSupplierConfig = useActionCreator(companyActions.fetchSupplierConfigs);

  const supplierConfigurationSampleData = [
    { id: '1', supplierType: [{ id: '12', text: 'ConsultantContractors' }], capabilities: [{ id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }, { id: '12', text: 'Approved' }], services: [{ id: '12', text: 'Approved' }] },
    { id: '2', supplierType: [{ id: '12', text: 'ConsultantContractors' }], capabilities: [{ id: '12', text: 'Approved' }], services: [{ id: '12', text: 'Approved' }] },
    { id: '3', supplierType: [{ id: '12', text: 'ConsultantContractors' }], capabilities: [{ id: '12', text: 'Approved' }], services: [{ id: '12', text: 'Approved' }] },
    { id: '4', supplierType: [{ id: '12', text: 'ConsultantContractors' }], capabilities: [{ id: '12', text: 'Approved' }], services: [{ id: '12', text: 'Approved' }] },
  ];

  const [supplierConfiguration, setSupplierConfiguration] = React.useState<SupplierConfig[]>(supplierConfigurationSampleData);
  const [capabilities, setCapabilities] = React.useState<OptionType[]>();
  const [services, setServices] = React.useState<OptionType[]>();
  const [types, setTypes] = React.useState<OptionType[]>();
  const [editedSupplierConfiguration, setEditedSupplierConfiguration] = React.useState<EditableSupplierConfig>();

  const discardSupplierConfiguration = () => setEditedSupplierConfiguration(undefined);

  const deleteSupplierConfiguration = (dataItem: EditableSupplierConfig) => {
    const updateSupplierConfiguration = supplierConfiguration.filter((config) => { return config.id !== dataItem.id; });
    setSupplierConfiguration(updateSupplierConfiguration);
  };

  // const changeCompanyAction = useActionCreator(companyActions.updateCompanyMine);

  // const async = useAsync({
  //   onSuccess: submitSettingsForm,
  //   onError: (error) => {
  //     setSupplierConfiguration(supplierConfiguration);
  //     toastError(error);
  //   },
  // });

  const capabilitiesAsync = useAsync<OptionType[]>({
    onSuccess: (data) => {
      setCapabilities(data);
    },
    onError: toastError,
  });

  const supplierServiesAsync = useAsync<OptionType[]>({
    onSuccess: (data) => {
      setServices(data);
    },
    onError: toastError,
  });

  const supplierTypesAsync = useAsync<OptionType[]>({
    onSuccess: (data) => {
      setTypes(data);
    },
    onError: toastError,
  });

  useEffect(() => {
    capabilitiesAsync.start(fetchSupplierConfig, SUPPLIER_FIELDS.capabilities, capabilitiesAsync);
    supplierServiesAsync.start(fetchSupplierConfig, SUPPLIER_FIELDS.services, supplierServiesAsync);
    supplierTypesAsync.start(fetchSupplierConfig, SUPPLIER_FIELDS.type, supplierTypesAsync);
  }, []);

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
      capabilities: [],
      services: [],
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
    onDelete: deleteSupplierConfiguration,
    capabilities,
    services,
    types,
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
