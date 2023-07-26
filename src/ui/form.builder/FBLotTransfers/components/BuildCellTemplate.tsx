import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { Autocomplete, FormikField } from '../../../components/forms/fields-next';
import { documentVersionPath } from '../../../document.revision/utils/paths';
import { CustomTemplateProps, DocumentRevisionOption, EditableLotTransfer } from '../types';
import { getOptionLabel } from '../utils';

interface Props extends CustomTemplateProps {
  options?: DocumentRevisionOption[]
}

export const BuildCellTemplate: React.FC<Props> = ({ dataItem, field, options, onClick }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableLotTransfer>();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const handleChange = (event: ChangeEvent<unknown>, build?: DocumentRevisionOption) => {
    const value = build ? {
      id: build.id,
      docId: build.document.docId,
    } : undefined;

    setFieldValue('build', value);
  };

  const defaultValue = isEditMode ? values.build?.id : dataItem.build?.id;
  const value = options?.find((build) => build.id === defaultValue);

  // TODO recheck isEmpty condition after upgrading MUI Autocomplete
  if (isEditMode && !isEmpty(values)) {
    return (
      <FormikField
        name="build"
      >
        <Autocomplete
          {...getFieldProps('build')}
          blurOnSelect
          options={options}
          getOptionLabel={getOptionLabel}
          value={value}
          onChange={handleChange}
          size="small"
        />
      </FormikField>
    );
  }

  const displayValue = dataItem[field] as string;
  const linkPath = value ? documentVersionPath(value?.id, value?.document.id) : undefined;

  const handleClick = () => {
    !linkPath && onClick?.({ dataItem });
  };

  return (
    <Box onClick={handleClick}>
      <OverflowTooltip
        title={displayValue}
        placement="top"
        interactive
        arrow
        onClick={handleClick}
      >
        {linkPath ? <Link target="_blank" to={linkPath}>{displayValue}</Link> : displayValue}
      </OverflowTooltip>
    </Box>
  );
};
