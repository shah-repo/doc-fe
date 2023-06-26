import { Box, Chip, CircularProgress } from '@material-ui/core';
import cx from 'classnames';
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
  const stageData = dataItem.signatureStages[stage];

  if (!stageData) {
    return null;
  }

  const allItems = [
    ...dataItem.signatureStages[stage].groups,
    ...dataItem.signatureStages[stage].employees,
  ];

  return (
    <Box onClick={handleClick} className={classes.chips}>
      {allItems.map((item) => (
        <Chip
          size="small"
          label={item.name === '' ? <CircularProgress size={12} /> : item.name}
          key={item.id}
          className={cx({ [classes.activeChip]: Boolean(onClick) })}
        />
      ))}
    </Box>
  );
};

export default GroupsCellTemplate;
