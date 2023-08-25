import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { Mode, MODE_FIELD } from '../../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import { EditableAlternatePart } from '../../treelist/interface';
import { CustomTemplateProps } from '../types';

export const LeadTimeCell: React.FC<CustomTemplateProps> = ({ dataItem, field, onClick }) => {
  const { values } = useFormikContext<EditableAlternatePart>();
  const isAddMode = [Mode.add].includes(dataItem[MODE_FIELD]);
  const displayValue = (isAddMode ? values.leadTime : dataItem[field]) as string;

  const onRowClick = (evt) => {
    evt.preventDefault();
    onClick?.({ dataItem });
  };

  return (
    <Box onClick={onRowClick}>
      <OverflowTooltip
        title={displayValue}
        placement="top"
        interactive
        arrow
      >
        {displayValue}
      </OverflowTooltip>
    </Box>
  );
};
