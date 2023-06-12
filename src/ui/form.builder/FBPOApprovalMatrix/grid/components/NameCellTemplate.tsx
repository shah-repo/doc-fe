import { Box } from '@material-ui/core';
import React from 'react';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { POApprovalMatrixLevelItem, RowClickEvent } from '../types';

interface Props extends CellTemplateProps<POApprovalMatrixLevelItem> {
  onClick?: (e: RowClickEvent) => void
}

const NameCellTemplate: React.FC<Props> = ({
  dataItem,
  onClick,
}) => {
  const handleClick = () => onClick?.({ dataItem });

  return (
    <Box onClick={handleClick}>
      <OverflowTooltip
        arrow
        placement="top"
        title={dataItem.name}
      >
        {dataItem.name}
      </OverflowTooltip>
    </Box>
  );
};

export default NameCellTemplate;
