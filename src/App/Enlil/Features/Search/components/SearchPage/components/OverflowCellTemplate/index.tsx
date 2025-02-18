import { get } from 'lodash';
import React from 'react';
import { CellTemplateProps } from '../../../../../../../../ui/components/KendoDataGrid/KendoDataGrid.types';
import OverflowTooltip from '../../../../../../../../ui/components/OverflowTooltip';
import { Document } from '../../../../types';

const OverflowCellTemplate: React.FC<CellTemplateProps<Document>> = ({ dataItem, field, onClick }) => {
  const handleClick = (event) => onClick?.({ ...event, dataItem });
  const value = get(dataItem, field, '');

  return (
    <OverflowTooltip
      arrow
      placement="top"
      title={value}
      onClick={handleClick}
    >
      {value}
    </OverflowTooltip>
  );
};

export default OverflowCellTemplate;
