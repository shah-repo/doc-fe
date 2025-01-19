import { FormikProvider, useFormik, useFormikContext } from 'formik';
import { isArray, isEmpty, kebabCase, omit } from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../../common/intl';
import { getHasPermission } from '../../../../../../common/utils/selectors';
import { Permission } from '../../../../../../state/ducks/auth/types';
import { companyActions } from '../../../../../../state/ducks/company';
import { GeneralSettings } from '../../../../../../state/ducks/company/types';
import { Mode, MODE_FIELD } from '../../../../../components/KendoDataGrid/constants';
import { toastError } from '../../../../../components/notifications';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import SettingsPanel from '../../../components/SettingsPanel';
import SettingsTable from '../../../components/SettingsTable';
import { SettingsPanelProps } from '../../../types';
import { EDIT_FIELDS } from './constants';
import { buildSchema } from './schema';
import { EditableSupplierConfig, OptionType, SUPPLIER_FIELDS, SupplierConfig } from './types';

const SupplierConfiguration: React.FC<SettingsPanelProps> = (props) => {
  const isActive = useSelector(getHasPermission(Permission.EDIT_SUPPLIER_CONFIG));
  const fetchSupplierConfig = useActionCreator(companyActions.fetchSupplierConfigs);
  const { values: formValues } = useFormikContext<GeneralSettings>();
  const [supplierConfiguration, setSupplierConfiguration] = React.useState<SupplierConfig[]>();
  const [capabilities, setCapabilities] = React.useState<OptionType[]>();
  const [services, setServices] = React.useState<OptionType[]>();
  const [types, setTypes] = React.useState<OptionType[]>();
  const [editedSupplierConfiguration, setEditedSupplierConfiguration] = React.useState<EditableSupplierConfig>();

  const discardSupplierConfiguration = () => setEditedSupplierConfiguration(undefined);

  const deleteSupplierConfiguration = (dataItem: EditableSupplierConfig) => {
    const updateSupplierConfiguration = supplierConfiguration?.filter((config) => { return config.id !== dataItem.id; });
    setSupplierConfiguration(updateSupplierConfiguration);
  };

  const updateASLStatusSettings = useActionCreator(
    companyActions.updateGeneralSettings,
  );

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

  const async = useAsync({
    onError: (error) => {
      setSupplierConfiguration(supplierConfiguration);
      toastError(error);
    },
  });

  useEffect(() => {
    capabilitiesAsync.start(fetchSupplierConfig, SUPPLIER_FIELDS.capabilities, capabilitiesAsync);
    supplierServiesAsync.start(fetchSupplierConfig, SUPPLIER_FIELDS.services, supplierServiesAsync);
    supplierTypesAsync.start(fetchSupplierConfig, SUPPLIER_FIELDS.type, supplierTypesAsync);
  }, []);

  useEffect(() => {
    setSupplierConfiguration(formValues?.supplierConfig);
  }, [formValues?.supplierConfig]);

  const updateSupplierConfiguration = (updatedSupplierConfig: SupplierConfig[]) => {
    setSupplierConfiguration(updatedSupplierConfig);
    if (formValues) {
      async.start(
        updateASLStatusSettings,
        { ...formValues, supplierConfig: updatedSupplierConfig },
        '',
        'POST',
        async,
      );
    }
  };

  const formik = useFormik<EditableSupplierConfig | Record<string, never>>({
    initialValues: {},
    validate: (values) => {
      const error: Record<string, string> = {};
      if (isEmpty(values.text)) {
        error.name = 'validators.required';
      }
      return error;
    },
    onSubmit: (values) => {
      const isAddition = values[MODE_FIELD] === Mode.add;
      const updatedValues = {
        ...omit(values, [MODE_FIELD, ...EDIT_FIELDS]),
        capabilities: values.capabilities_edit,
        services: values.services_edit,
      };
      const updatedSupplierConfig = isAddition
        ? [...(supplierConfiguration ?? []), updatedValues]
        : supplierConfiguration?.map((aslStatus) =>
          aslStatus.id === values.id ? updatedValues : aslStatus,
        );

      discardSupplierConfiguration();
      updateSupplierConfiguration((updatedSupplierConfig ?? []) as SupplierConfig[]);
    },
  });
  const { setValues, submitForm } = formik;

  const changeLocationActiveState = (configuration: EditableSupplierConfig, state: boolean) => {
    const updatedSupplierConfig = supplierConfiguration?.map(it => it.id === configuration.id ? { ...it, active: state } : it);
    updateSupplierConfiguration(updatedSupplierConfig ?? []);
  };

  useEffect(() => {
    setValues(editedSupplierConfiguration ?? {});
  }, [editedSupplierConfiguration, setValues]);

  const addSupplierConfig = () => {
    setEditedSupplierConfiguration({
      id: uuidv4(),
      text: '',
      capabilities: [],
      supplierTypeId: '',
      services: [],
      [MODE_FIELD]: Mode.add,
      services_edit: '',
      capabilities_edit: '',
    });
  };

  const mappedLocations = supplierConfiguration?.map((supplierConfiguration) => {
    return {
      ...supplierConfiguration,
      [MODE_FIELD]: supplierConfiguration.id === editedSupplierConfiguration?.id ? Mode.edit : Mode.show,
    };
  }) ?? [];

  const locationsList
    = (editedSupplierConfiguration?.[MODE_FIELD] === Mode.add
      ? [...mappedLocations, editedSupplierConfiguration]
      : mappedLocations).map((location) => {
      const { capabilities, services } = location;

      return {
        ...location,
        ...(isArray(capabilities) && { capabilities: capabilities?.map(item => item.text).join(', ') }),
        ...(isArray(services) && { services: services?.map(item => item.text).join(', ') }),
        capabilities_edit: capabilities,
        services_edit: services,
      };
    });

  const dataCyGenerator = (SupplierConfig: EditableSupplierConfig) => ({
    'data-cy': `row-${kebabCase(SupplierConfig.text)}`,
  });

  const schema = buildSchema({
    isActive,
    onEdit: isActive ? setEditedSupplierConfiguration : undefined,
    onActiveStateChange: isActive ? changeLocationActiveState : undefined,
    onDiscard: discardSupplierConfiguration,
    onDelete: isActive ? deleteSupplierConfiguration : undefined,
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
          data={locationsList as unknown as EditableSupplierConfig[]}
          isEditing={editedSupplierConfiguration !== undefined}
          schema={schema}
          addButtonLabel={translate('common.add.new')}
          onAdd={addSupplierConfig}
          getRowProperties={dataCyGenerator}
          isFilterable
        />
      </FormikProvider>
    </SettingsPanel>
  );
};
export default SupplierConfiguration;
