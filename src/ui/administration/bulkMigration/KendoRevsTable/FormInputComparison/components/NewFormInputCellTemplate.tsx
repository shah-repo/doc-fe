import { get } from 'lodash';
import React from 'react';
import ReactJson from 'react-json-view';
import { translate } from '../../../../../../common/intl';
import { ISupplierScanResultRev } from '../../../interface';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';

export const NewFormInputCellTemplate: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  const { isMapped } = dataItem;
  const formInput = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as ISupplierScanResultRev['originalFormInput'];
  const noInput = !formInput;
  const notMapped = !isMapped;

  if (noInput || notMapped) {
    return (
      <>
        {noInput && <span>{translate('administration.bulk.migration.comparison.grid.cell.noFormInput')}</span>}
        {notMapped && <span>{translate('administration.bulk.migration.comparison.grid.cell.notMapped')}</span>}
      </>
    );
  }

  return <ReactJson src={formInput} collapsed={1} />;
};
