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

  const labelValue = documentId ? label : EMPTY_PLACEHOLDER;

  return (
    <OverflowTooltip
      title={labelValue}
      onClick={handleClick}
      placement="top"
      interactive
      arrow
    >
      { labelValue }
    </OverflowTooltip>
  );
};
