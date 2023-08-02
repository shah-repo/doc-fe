import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { Autocomplete, FormikField } from '../../../components/forms/fields-next';
import { documentVersionPath } from '../../../document.revision/utils/paths';
import { CustomTemplateProps, EditableVendor, SupplierOption } from '../types';
import OverflowingContent from './OveflowContent';

interface Props extends CustomTemplateProps {
  options: SupplierOption[]
}

const getOptionLabel = (option: SupplierOption) => {
  return option.name ? option.name : option.document?.docId;
};

const Editor: React.FC<Props> = ({ field, options }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, setFieldValue, getFieldProps } = useFormikContext<EditableVendor>();

  const handleChange = (event: ChangeEvent<unknown>, value?: string) => {
    setFieldValue('vendor', value);
  };

  const value = options?.find(vendor => vendor.id === values.vendor?.id);

  return (
    <FormikField
      name="vendor"
      required
    >
      <Autocomplete
        {...getFieldProps(field)}
        key={isEmpty(values) ? 'disabled' : 'enabled'}
        blurOnSelect
        disableClearable
        options={options}
        value={value}
        getOptionLabel={getOptionLabel}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};

export const SupplierCellTemplate: React.FC<Props> = (props) => {
  const { dataItem, field, options, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => {
    !linkPath && onClick?.({ dataItem });
  };

  const value = options?.find(vendor => vendor.id === dataItem.vendor?.id);
  const linkPath = value ? documentVersionPath(value?.id, value?.document.id) : undefined;
  const displayValue = dataItem[field] as string;

  return (
    <OverflowingContent onClick={handleClick} title={displayValue}>
      {linkPath ? <Link target="_blank" to={linkPath}>{displayValue}</Link> : displayValue}
    </OverflowingContent>
  );
};
