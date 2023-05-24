import { Box, Chip } from '@material-ui/core';
import React from 'react';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import useStyles from '../styles';
import { POApprovalMatrixLevelItem, RowClickEvent } from '../types';

interface Props extends CellTemplateProps<POApprovalMatrixLevelItem> {
  onClick?: (e: RowClickEvent) => void
  stage: number
}

const GroupsCellTemplate: React.FC<Props> = ({
  stage,
  dataItem,
  onClick,
}) => {
  const classes = useStyles();

  const handleClick = () => onClick?.({ dataItem });

  const allItems = [
    ...dataItem.signatureStages[stage].groups,
    ...dataItem.signatureStages[stage].employees,
  ];

  return (
    <Box onClick={handleClick} className={classes.chips}>
      {allItems.map((item) => (
        <Chip size="small" label={item.name} key={item.id} />
      ))}
    </Box>
  );
};

export default GroupsCellTemplate;
