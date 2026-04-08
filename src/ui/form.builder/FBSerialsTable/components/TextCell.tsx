import { get } from 'lodash';
import React from 'react';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { SerialNumber } from '../../FBSerials/types';

interface Props {
  field: string
  dataItem: SerialNumber
}
const TextCell: React.FC<Props> = ({ dataItem, field }) => {
  const defaultValue = get(dataItem, field, '') as string;

  return (
    <OverflowTooltip
      title={defaultValue}
      placement="top"
      arrow
    >
      {defaultValue}
    </OverflowTooltip>
  );
};

export default TextCell;
