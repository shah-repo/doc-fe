import { useFormikContext } from 'formik';
import React from 'react';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { EMPTY_PLACEHOLDER, Mode, MODE_FIELD } from '../constants';
import { CustomTemplateProps, EditableLHRTableItem, IPrecalcEntry } from '../types';

export const PartRevCell: React.FC<CustomTemplateProps> = ({ dataItem, field, onClick }) => {
  const { values } = useFormikContext<EditableLHRTableItem>();
  const isAddMode = [Mode.add].includes(dataItem[MODE_FIELD]);
  const { label, documentId }
    = ((isAddMode ? values[field] ?? dataItem[field] : dataItem[field]) ?? {}) as IPrecalcEntry;

  const handleClick = () => {
    onClick?.({ dataItem });
  };

  const textToDisplay = () => {
    if (documentId) {
      return label;
    }
    return EMPTY_PLACEHOLDER;
  };

  return (
    <OverflowTooltip
      title={textToDisplay()}
      onClick={handleClick}
      placement="top"
      interactive
      arrow
    >
      { textToDisplay() }
    </OverflowTooltip>
  );
};
