import { get } from 'lodash';
import React from 'react';
import ReactJson from 'react-json-view';
import { translate } from '../../../../../../common/intl';
import { ISupplierScanResultRev } from '../../../interface';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';

export const NewFormInputCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { field, dataItem } = props;
  const { isMapped } = dataItem;
  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as Pick<ISupplierScanResultRev, 'originalFormInput'>;

  if (!displayValue || !isMapped) {
    return (<>
      {!displayValue && <span>{translate('administration.bulk.migration.comparison.grid.cell.noFormInput')}</span> }
      {!isMapped && <span>{translate('administration.bulk.migration.comparison.grid.cell.notMapped')}</span> }
    </>);
  }

  return (
    <ReactJson src={displayValue} collapsed={1} />
  );
};
