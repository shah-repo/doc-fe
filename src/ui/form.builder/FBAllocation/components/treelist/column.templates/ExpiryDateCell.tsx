import cx from 'classnames';
import React from 'react';
import OverflowContent from '../../../components/OverflowContent';
import useStyles from '../styles';
import { CustomTemplateProps } from '../types';

export const ExpiryDateCell: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, field, onClick } = props;
  const classes = useStyles();

  const handleClick = () => onClick?.({ dataItem });
  const displayValue = dataItem[field] as string;

  return (
    <OverflowContent
      title={<div className={cx('containing-box-scrollbar', classes.tooltipContent)}>{displayValue}</div>}
      onClick={handleClick}
    >
      {displayValue}
    </OverflowContent>
  );
};
