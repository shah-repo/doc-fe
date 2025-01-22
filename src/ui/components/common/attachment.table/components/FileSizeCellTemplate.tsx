import { get } from 'lodash';
import React, { useMemo } from 'react';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../KendoDataGrid/constants';

const FileSizeCellTemplate: React.FC<any> = (props) => {
  const { dataItem, field } = props;
  const size = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as number;
  const fileSize = useMemo(() => {
    const i = size !== 0 ? Math.floor(Math.log(Number(size)) / Math.log(1024)) : 0.00;
    return `${(Number(size) / Math.pow(1024, i)).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
  }, [size]);
  return (
    <>{fileSize}</>
  );
};

export default FileSizeCellTemplate;
