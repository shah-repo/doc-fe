import { get } from 'lodash';
import React from 'react';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';
import { styles } from './styles';

export const NameCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { field, dataItem } = props;
  const { displayRevision, displayStatus } = dataItem;
  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;

  return (
    <p className={classes.revsTableFlexBoxColumn}>
      <span><b>{displayValue}</b></span>
      <span>Rev {displayRevision} • {displayStatus}</span>
    </p>
  );
};
