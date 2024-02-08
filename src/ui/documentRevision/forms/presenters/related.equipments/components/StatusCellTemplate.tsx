import { Box, Chip } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import useStyles from '../../../../../components/common/kendo.column.templates/Status.styles';
import { statusClassMapping } from '../../../../../components/common/kendo/helpers';
import { CustomTemplateProps } from '../types';
import { translate } from '../../../../../../common/intl';

interface StatusChipProps {
  value: string
  onClick?: () => void
}

const StatusChip: React.FC<StatusChipProps> = ({ value, onClick }) => {
  const classes = useStyles();
  const statusClass = value ? statusClassMapping[value] as keyof typeof classes : '';

  return (
    <Box className={classes.wrapper} onClick={onClick}>
      <Chip
        size="small"
        className={cx(classes.chip, classes[statusClass])}
        label={translate(value)}
      />
    </Box>
  );
};

const StatusCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { field, dataItem, onClick } = props;

  const value = dataItem[field] as string;
  const handleClick = () => onClick?.({ dataItem });

  return <StatusChip value={value} onClick={handleClick} />;
};

export default StatusCellTemplate;
