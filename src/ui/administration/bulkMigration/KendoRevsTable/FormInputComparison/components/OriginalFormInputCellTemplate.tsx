import { get } from 'lodash';
import React from 'react';
import ReactJson from 'react-json-view';
import { translate } from '../../../../../../common/intl';
import { SupplierScanResultRevision } from '../../../interface';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';

export const OriginalFormInputCellTemplate: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  const formInput = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as SupplierScanResultRevision['originalFormInput'];

  if (!formInput) {
    return <span>{translate('administration.bulk.migration.comparison.grid.cell.noFormInput')}</span>;
  }

  return <ReactJson src={formInput} collapsed={1} />;
};
