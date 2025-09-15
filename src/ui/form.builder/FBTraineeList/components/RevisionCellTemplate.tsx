import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import React from 'react';
import { EMPTY_VALUE_PLACEHOLDER, Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { CustomTemplateProps, DocumentOption, EditableTrainee } from '../types';
import { getOptionLabel } from '../utils';
import { AutocompleteCellTemplate } from './AutocompleteCellTemplate';

interface Props extends CustomTemplateProps {
  options?: DocumentOption[]
  fieldToEdit?: string
}

const getValue = (item?: DocumentOption) => {
  if (!item) {
    return undefined;
  }

  const latestDocRev = item.documentRevisions.at(-1);

  return {
    docId: item.docId,
    documentId: item.id,
    docRevId: latestDocRev?.id,
    displayRevision: item.displayRevision,
  };
};

const getKey = item => item?.documentId;

export const RevisionCellTemplate: React.FC<Props> = (props) => {
  const { dataItem, field, fieldToEdit, options, onClick } = props;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values } = useFormikContext<EditableTrainee>() ?? {};
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const targetField = fieldToEdit ?? field;

  const source = isEditMode ? values : dataItem;
  const value = get(source, targetField) as DocumentOption;
  const displayValue = value ? getOptionLabel(value) : EMPTY_VALUE_PLACEHOLDER;

  // TODO recheck isEmpty condition after upgrading MUI Autocomplete
  if (isEditMode && !isEmpty(values)) {
    return (
      <AutocompleteCellTemplate
        {...props}
        getOptionLabel={getOptionLabel}
        renderStoredValue={() => displayValue}
        options={options ?? []}
        getValue={getValue}
        getKey={getKey}
        getOptionDisabled={() => false}
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
