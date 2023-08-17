import React from 'react';
import { get } from 'lodash';
import OverflowTooltip from '../../../../../../../../ui/components/OverflowTooltip';
import { CellTemplateProps } from '../../../../../../../../ui/components/KendoDataGrid/KendoDataGrid.types';
import { Document } from '../../../../types';
import { GridRowClickEvent } from '@progress/kendo-react-grid';

interface Props extends CellTemplateProps<Document> {
  onClick?: (e: GridRowClickEvent) => void
}

const OverflowCellTemplate: React.FC<Props> = ({ dataItem, field, onClick }) => {
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
