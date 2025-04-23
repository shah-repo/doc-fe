import { get } from 'lodash';
import React from 'react';
import ReactJson from 'react-json-view';
import { translate } from '../../../../../../common/intl';
import { ISupplierScanResultRev } from '../../../interface';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';

export const OriginalFormInputCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { field, dataItem } = props;
  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as Pick<ISupplierScanResultRev, 'originalFormInput'>;

  if (!displayValue) {
    return (<span>{translate('administration.bulk.migration.comparison.grid.cell.noFormInput')}</span>);
  }

  return (
    <ReactJson src={displayValue} collapsed={1} />
  );
};
