import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { Autocomplete, FormikField } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../../FBApprovalMatrixRoles/constants';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { BuildOption, CustomTemplateProps, EditableLotTransfer } from '../types';

interface Props extends CustomTemplateProps {
  builds?: BuildOption[]
}

const getOptionLabel = (option: BuildOption) => {
  const baseLabel = `${option.document?.docId} - rev ${option.displayRevision}`;
  return option.name ? `${baseLabel} - ${option.name}` : baseLabel;
};

export const BuildCellTemplate: React.FC<Props> = ({ dataItem, field, builds }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableLotTransfer>();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, build?: BuildOption) => {
    const value = build ? {
      id: build.id,
      docId: build.document.docId,
    } : undefined;

    setFieldValue(field, value);
  };

  const defaultValue = isEditMode ? values.build?.id : dataItem.build?.id;
  const value = builds?.find((build) => build.id === defaultValue);

  // TODO recheck isEmpty condition after upgrading MUI Autocomplete
  if (isEditMode && !isEmpty(values)) {
    return (
      <FormikField
        name={field}
      >
        <Autocomplete
          {...getFieldProps(field)}
          blurOnSelect
          options={builds}
          getOptionLabel={getOptionLabel}
          value={value}
          onChange={handleChange}
          size="small"
        />
      </FormikField>
    );
  }

  return <>{value ? getOptionLabel(value) : EMPTY_VALUE_PLACEHOLDER}</>;
};
