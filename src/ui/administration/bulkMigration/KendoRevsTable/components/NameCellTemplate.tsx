import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../../common/intl';
import OverflowContent from '../../../../components/OverflowContent';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';
import { styles as useStyles } from './styles';

export const NameCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = useStyles();
  const { field, dataItem } = props;
  const { displayRevision, displayStatus } = dataItem;
  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;

  return (
    <p className={classes.revsTableFlexBoxColumn}>
      <OverflowContent title={displayValue}>
        <span className={classes.revsTableName}>{displayValue}</span>
      </OverflowContent>
      <span>{translate('administration.bulk.migration.rev.grid.cell.revision', { displayRevision, displayStatus })}</span>
    </p>
  );
};
