import { useFormikContext } from 'formik';
import { get, kebabCase } from 'lodash';
import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import OverflowingContent from '../../../../../../../change.request/FBMaterialDisposition/components/commonCells/OveflowContent';
import { FormikField, TextField } from '../../../../../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';

const Editor: React.FC<CustomTemplateProps> = ({ field }) => {
  const { getFieldProps } = useFormikContext();

  return (
    <FormikField
      name={field}
    >
      <TextField
        {...getFieldProps(field)}
        defaultValue={undefined}
        placeholder={translate('form.builder.enter')}
        type="text"
        size="small"
      />
    </FormikField>
  );
};

export const TextInputCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { field, dataItem, colSpan, style, className } = props;
  const isEditMode = dataItem.isAddPhase;
  const datCy = `${kebabCase(field)}-td`;

  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-cy={datCy}
    >
      {isEditMode && <Editor {...props} />}
      {!isEditMode && <OverflowingContent>
        {displayValue}
      </OverflowingContent>}
    </td>
  );
};
