import { Box, makeStyles } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import React from 'react';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps, DocumentOption, EditableTrainee } from '../types';
import { getOptionLabel } from '../utils';
import { AutocompleteCellTemplate } from './AutocompleteCellTemplate';

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

const getKey = item => item?.documentId;

export const RevisionCellTemplate: React.FC<Props> = (props) => {
  const { dataItem, field, fieldToEdit, options, onClick } = props;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values } = useFormikContext<EditableTrainee>() ?? {};
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const classes = useStyles();
  const targetField = fieldToEdit ?? field;

  const source = isEditMode ? values : dataItem;
  const defaultValue = get(source, `${targetField}.documentId`, '') as string;
  const value = options?.find((revision) => revision.id === defaultValue);

  const displayValue = value ? getOptionLabel(value) : EMPTY_VALUE_PLACEHOLDER;

  // TODO recheck isEmpty condition after upgrading MUI Autocomplete
  if (isEditMode && !isEmpty(values)) {
    return (
      <AutocompleteCellTemplate
        {...props}
        getOptionLabel={getOptionLabel}
        renderStoredValue={displayValue}
        options={options}
        getValue={getValue}
        getKey={getKey}
        renderOption={(option) => <div className={classes.wrap}>{getOptionLabel(option)}</div>}
        getOptionDisabled={false}
      />
    );
  }

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
