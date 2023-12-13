import { useFormikContext } from 'formik';
import React from 'react';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { Mode, MODE_FIELD } from '../constants';
import { CustomTemplateProps, EditableLHRTableItem } from '../types';

export const LhrTemplateCell: React.FC<CustomTemplateProps> = ({ dataItem, field, onClick }) => {
  const { values } = useFormikContext<EditableLHRTableItem>();
  const isAddMode = [Mode.add].includes(dataItem[MODE_FIELD]);
  const lhrTemplateId = (isAddMode ? values[field] ?? dataItem[field] : dataItem[field]) as string;

  const handleClick = () => {
    onClick?.({ dataItem });
  };

  return (
    <OverflowTooltip
      title={lhrTemplateId}
      onClick={handleClick}
      placement="top"
      interactive
      arrow
    >
      { lhrTemplateId }
    </OverflowTooltip>
  );
};
