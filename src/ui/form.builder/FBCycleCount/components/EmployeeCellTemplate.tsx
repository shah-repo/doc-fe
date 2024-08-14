import cx from 'classnames';
import { get } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../../state/ducks/auth';
import { EMPTY_VALUE_PLACEHOLDER, MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import OverflowContent from '../../../components/OverflowContent';
import { Autocomplete } from '../../../components/forms/fields-next';
import useStyles from '../styles';
import { CustomTemplateProps } from '../types';

const Editor: React.FC<CustomTemplateProps> = () => {
  const userName = useSelector(authSelectors.currentUserName);

  return (
    <Autocomplete
      options={[userName]}
      value={userName}
      size="small"
      disabled
    />
  );
};

export const EmployeeCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, field, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const classes = useStyles();

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });
  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;

  return (
    <OverflowContent
      title={<div className={cx('containing-box-scrollbar', classes.tooltipContent)}>{displayValue}</div>}
      onClick={handleClick}
    >
      {displayValue}
    </OverflowContent>
  );
};
