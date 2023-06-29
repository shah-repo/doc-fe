import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { Autocomplete, FormikField } from '../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { BuildOption, CustomTemplateProps, EditableLotTransfer } from '../types';

interface Props extends CustomTemplateProps {
  builds?: BuildOption[]
}

const getOptionLabel = (option: BuildOption) => {
  const baseLabel = `${option.document?.docId} - rev ${option.displayRevision}`;
  return option.name ? `${baseLabel} - ${option.name}` : baseLabel;
};

export const BuildCellTemplate: React.FC<Props> = ({ dataItem, builds }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableLotTransfer>();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, build?: BuildOption) => {
    const value = build ? {
      id: build.id,
      docId: build.document.docId,
    } : undefined;

    setFieldValue('build', value);
  };

  const defaultValue = isEditMode ? values.build?.id : dataItem.build?.id;
  const value = builds?.find((build) => build.id === defaultValue);

  // TODO recheck isEmpty condition after upgrading MUI Autocomplete
  if (isEditMode && !isEmpty(values)) {
    return (
      <FormikField
        name="build"
      >
        <Autocomplete
          {...getFieldProps('build')}
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
