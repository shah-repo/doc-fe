import { Box, makeStyles } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../common/intl';
import { Autocomplete, FormikField } from '../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps, DocumentOption, EditableTrainee } from '../types';
import { getOptionLabel } from '../utils';

interface Props extends CustomTemplateProps {
  options?: DocumentOption[]
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

const getValue = (item?: DocumentOption) => {
  if (!item) {
    return undefined;
  }

  return {
    docId: item.docId,
    documentId: item.id,
    docRevId: item.documentRevisions?.[0]?.id,
  };
};

export const RevisionCellTemplate: React.FC<Props> = ({ dataItem, field, fieldToEdit, options, column, onClick }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableTrainee>() ?? {};
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const classes = useStyles();
  const targetField = fieldToEdit ?? field;

  const handleChange = (event: ChangeEvent<unknown>, option?: DocumentOption) => {
    setFieldValue(targetField, getValue(option));
  };

  const source = isEditMode ? values : dataItem;
  const defaultValue = get(source, `${targetField}.documentId`, '') as string;
  const value = options?.find((revision) => revision.id === defaultValue);

  // TODO recheck isEmpty condition after upgrading MUI Autocomplete
  if (isEditMode && !isEmpty(values)) {
    return (
      <FormikField name={targetField} error={isEmpty(value)}>
        <Autocomplete
          {...getFieldProps?.(targetField)}
          placeholder={translate(column.title ?? '')}
          blurOnSelect
          options={options}
          disableClearable
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

  const displayValue = value ? getOptionLabel(value) : EMPTY_VALUE_PLACEHOLDER;

  const handleClick = () => {
    onClick?.({ dataItem });
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
        {displayValue}
      </OverflowTooltip>
    </Box>
  );
};
