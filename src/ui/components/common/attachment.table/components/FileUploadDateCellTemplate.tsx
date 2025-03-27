import { get } from 'lodash';
import moment from 'moment';
import React from 'react';
import { MomentFormats } from '../../../../../common/utils/date';
import { Attachment } from '../../../../change.request/form/types';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../KendoDataGrid/constants';
import { CellTemplateProps } from '../../../KendoDataGrid/KendoDataGrid.types';

const FileUploadDateCellTemplate: React.FC<CellTemplateProps<Attachment>> = (props) => {
  const { dataItem, field } = props;
  const value = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;
  const date = moment(value).format(MomentFormats.MonthDateYearTwoDigit);

  return (
    <div>{date}</div>
  );
};

export default FileUploadDateCellTemplate;
