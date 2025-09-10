import { get } from 'lodash';
import React from 'react';
import { MomentFormats, useDate } from '../../../../../common/utils/date';
import { Attachment } from '../../../../change.request/form/types';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../KendoDataGrid/constants';
import { CellTemplateProps } from '../../../KendoDataGrid/KendoDataGrid.types';

const FileUploadDateCellTemplate: React.FC<CellTemplateProps<Attachment>> = (props) => {
  const { dataItem, field } = props;
  const { getFormattedDateString } = useDate();
  const value = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;
  const date = getFormattedDateString(value, MomentFormats.MonthDateYearTwoDigit);

  return (
    <div>{date}</div>
  );
};

export default FileUploadDateCellTemplate;
