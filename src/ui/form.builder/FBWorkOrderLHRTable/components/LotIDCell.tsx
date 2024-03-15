import { useFormikContext } from 'formik';
import React from 'react';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { Mode, MODE_FIELD } from '../constants';
import { CustomTemplateProps, EditableLHRTableItem } from '../types';

const LotIDCell: React.FC<CustomTemplateProps> = ({ dataItem, field }) => {
  const { values } = useFormikContext<EditableLHRTableItem>();
  const isAddMode = [Mode.add].includes(dataItem[MODE_FIELD]);
  const lotId = (isAddMode ? values[field] ?? dataItem[field] : dataItem[field]) as string;

  return (
    <OverflowTooltip
      title={lotId}
      placement="top"
      interactive
      arrow
    >
      {lotId}
    </OverflowTooltip>
  );
};

export default LotIDCell;
