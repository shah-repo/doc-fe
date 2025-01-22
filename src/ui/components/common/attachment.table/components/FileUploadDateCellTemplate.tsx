import { get } from 'lodash';
import moment from 'moment';
import React from 'react';
import { MomentFormats } from '../../../../../common/utils/date';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../KendoDataGrid/constants';

const FileUploadDateCellTemplate: React.FC<any> = (props) => {
  const { dataItem, field } = props;
  const value = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;
  const date = moment(value).format(MomentFormats.MonthDateYearTwoDigit);

  return (
    <div>{date}</div>
  );
};

export default FileUploadDateCellTemplate;
