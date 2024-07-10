import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import OverflowingContent from '../../../../../../../change.request/FBMaterialDisposition/components/commonCells/OveflowContent';
import { FormikField, TextField } from '../../../../../../../components/forms/fields-next';
import { CellTemplateProps } from '../../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { EDIT_FIELD } from '../constants';
import { LCP } from '../types';

const Editor: React.FC<CellTemplateProps<LCP>> = ({ dataItem, field }) => {
  const { getFieldProps } = useFormikContext();
  const value = dataItem[field];

  return (
    <FormikField
      name={field}
    >
      <TextField
        {...getFieldProps(field)}
        defaultValue={value}
        type="text"
        placeholder={translate('lhr.summary.placeholder.enter')}
        size="small"
      />
    </FormikField>
  );
};

export const LabelCell: React.FC<CellTemplateProps<LCP>> = (props) => {
  const { field, dataItem, onClick, colSpan, style, className } = props;
  const isEditMode = dataItem[EDIT_FIELD];
  const handleClick = () => onClick?.({ dataItem });
  const displayValue = get(dataItem, field, '') as string;

  return <td
    colSpan={colSpan}
    style={style}
    role="gridcell"
    className={className}
    data-cy="cell-alternate-parts"
  >
    {isEditMode && <Editor {...props} />}
    {!isEditMode && <OverflowingContent onClick={handleClick}>
      {displayValue}
    </OverflowingContent>}
  </td>;
};
