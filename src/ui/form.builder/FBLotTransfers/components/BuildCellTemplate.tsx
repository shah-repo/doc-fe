import React, { ChangeEvent } from 'react';
import { Autocomplete, FormField } from '../../../components/forms/fields-next';
import { MODE_FIELD, Mode } from '../../FBApprovalMatrixRoles/constants';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { BuildOption, CustomTemplateProps } from '../types';

interface Props extends CustomTemplateProps {
  builds?: BuildOption[]
}

const getOptionLabel = (option: BuildOption) => {
  const baseLabel = `${option.document?.docId} - rev ${option.displayRevision}`;
  return option.name ? `${baseLabel} - ${option.name}` : baseLabel;
};

export const BuildCellTemplate: React.FC<Props> = ({ dataIndex, dataItem, field, builds, onChange }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, build?: BuildOption) => {
    const value = build ? {
      id: build.id,
      docId: build.document.docId,
    } : undefined;

    onChange?.({
      dataItem,
      dataIndex,
      syntheticEvent: event,
      field,
      value,
    });
  };

  const value = builds?.find((build) => build.id === dataItem.build?.id);

  if (isEditMode) {
    return (
      <FormField>
        <Autocomplete
          blurOnSelect
          value={value}
          options={builds}
          getOptionLabel={getOptionLabel}
          onChange={handleChange}
        />
      </FormField>
    );
  }

  return <>{value ? getOptionLabel(value) : EMPTY_VALUE_PLACEHOLDER}</>;
};
