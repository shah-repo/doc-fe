import { FormikProvider, useFormik, useFormikContext } from 'formik';
import { isEmpty, kebabCase, omit } from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../../../common/intl';
import { getHasPermission } from '../../../../../../../common/utils/selectors';
import { Permission } from '../../../../../../../state/ducks/auth/types';
import { GeneralSettings } from '../../../../../../../state/ducks/company/types';
import {
  Mode,
  MODE_FIELD,
} from '../../../../../../components/KendoDataGrid/constants';
import SettingsTable from '../../../../components/SettingsTable';
import { buildSchema } from './schema';
import useStyle from './styles';
import {
  EditableSupplierLabel,
  SupplierLabel,
} from './types';

interface SupplierLabelsGridProps {
  name: string
}

const SupplierLabelsGrid: React.FC<SupplierLabelsGridProps> = ({ name }) => {
  const classes = useStyle();
  const isActive = useSelector(
    getHasPermission(Permission.EDIT_SUPPLIER_CONFIG),
  );
  const { values: formValues, setFieldValue } = useFormikContext<GeneralSettings>();
  const [labels, setLabels]
    = React.useState<SupplierLabel[]>();
  const [editedLabel, setEditedLabel]
    = React.useState<EditableSupplierLabel>();

  const discardLabel = () =>
    setEditedLabel(undefined);

  useEffect(() => {
    setLabels(formValues?.[name]);
  }, [formValues?.[name]]);

  const updateSupplierLabel = (
    labels: SupplierLabel[],
  ) => {
    setLabels(labels);
    setFieldValue(name, labels);
  };

  const formik = useFormik<EditableSupplierLabel | Record<string, never>>({
    initialValues: {},
    validate: (values: Partial<EditableSupplierLabel>) => {
      const error: Record<string, string> = {};
      if (isEmpty(values.text)) {
        error.text = 'validators.required';
      }
      return error;
    },
    onSubmit: (values: Partial<EditableSupplierLabel>) => {
      const isAddition = values[MODE_FIELD] === Mode.add;
      const updatedValues = {
        ...omit(values, [MODE_FIELD]),
      };

      const updatedSupplierLabels = isAddition
        ? [...(labels ?? []), updatedValues]
        : labels?.map((label) =>
          label.id === values.id ? updatedValues : label,
        );

      setFieldValue(name, updatedSupplierLabels);
      discardLabel();
    },
  });
  const { setValues, submitForm } = formik;

  const changeActiveState = (
    dataItem: EditableSupplierLabel,
    state: boolean,
  ) => {
    const updatedSupplierLabels = labels?.map(
      (label: SupplierLabel) =>
        label.id === dataItem.id
          ? { ...label, isActive: state }
          : label,
    );
    updateSupplierLabel(updatedSupplierLabels ?? []);
  };

  useEffect(() => {
    setValues(editedLabel ?? {});
  }, [editedLabel, setValues]);

  const addSupplierLabel = () => {
    setEditedLabel({
      id: uuidv4(),
      text: '',
      isActive: false,
      isUserAdded: true,
      [MODE_FIELD]: Mode.add,
    });
  };

  const mappedLabels
    = labels?.map((supplierConfiguration: SupplierLabel) => {
      return {
        ...supplierConfiguration,
        [MODE_FIELD]:
          supplierConfiguration.id === editedLabel?.id
            ? Mode.edit
            : Mode.show,
      };
    }) ?? [];

  const supplierLabelsList = (
    editedLabel?.[MODE_FIELD] === Mode.add
      ? [...mappedLabels, editedLabel]
      : mappedLabels
  );

  const dataCyGenerator = (supplierLabel: EditableSupplierLabel) => ({
    'data-cy': `row-${kebabCase(supplierLabel.text)}`,
  });

  const deleteSupplierLabel = (dataItem: EditableSupplierLabel) => {
    const updatedSupplierLabels = labels?.filter(
      (supplierLabel) => supplierLabel.id !== dataItem.id,
    );
    updateSupplierLabel(updatedSupplierLabels ?? []);
  };

  const schema = buildSchema({
    isActive,
    onEdit: isActive ? setEditedLabel : undefined,
    onActiveStateChange: isActive ? changeActiveState : undefined,
    onDiscard: discardLabel,
    onDelete: isActive ? deleteSupplierLabel : undefined,
    onConfirm: submitForm,
  });

  return (
    <FormikProvider value={formik}>
      <SettingsTable
        isActive={isActive}
        className={classes.root}
        data={supplierLabelsList}
        isEditing={editedLabel !== undefined}
        schema={schema}
        addButtonLabel={translate('common.add.new')}
        onAdd={addSupplierLabel}
        getRowProperties={dataCyGenerator}
      />
    </FormikProvider>
  );
};
export default SupplierLabelsGrid;
