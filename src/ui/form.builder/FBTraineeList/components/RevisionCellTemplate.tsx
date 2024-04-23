import { Box, makeStyles } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { Autocomplete, FormikField } from '../../../components/forms/fields-next';
import { documentVersionPath } from '../../../document.revision/utils/paths';
import { CustomTemplateProps, DocumentRevisionOption, EditableTrainee } from '../types';
import { getOptionLabel } from '../utils';

interface Props extends CustomTemplateProps {
  options?: DocumentRevisionOption[]
  fieldToEdit?: string
}

const useStyles = makeStyles({
  wrap: {
    maxWidth: '100%',
    display: '-webkit-box',
    overflow: 'hidden',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
});

export const RevisionCellTemplate: React.FC<Props> = ({ dataItem, field, fieldToEdit, options, onClick }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableTrainee>();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const classes = useStyles();
  const targetField = fieldToEdit ?? field;

  const handleChange = (event: ChangeEvent<unknown>, reference?: DocumentRevisionOption) => {
    const value = reference ? {
      id: reference.id,
      docId: reference.document.docId,
    } : undefined;

    setFieldValue(targetField, value);
  };

  const source = isEditMode ? values : dataItem;
  const defaultValue = source[targetField] as DocumentRevisionOption | undefined;
  const value = options?.find((revision) => revision.id === defaultValue?.id);

  // TODO recheck isEmpty condition after upgrading MUI Autocomplete
  if (isEditMode && !isEmpty(values)) {
    return (
      <FormikField name={targetField}>
        <Autocomplete
          {...getFieldProps(targetField)}
          blurOnSelect
          options={options}
          getOptionLabel={getOptionLabel}
          renderOption={(option) => <div className={classes.wrap}>{getOptionLabel(option)}</div>}
          value={value}
          defaultValue={value}
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
