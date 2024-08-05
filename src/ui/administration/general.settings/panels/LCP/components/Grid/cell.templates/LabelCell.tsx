import { useFormikContext } from 'formik';
import { kebabCase } from 'lodash';
import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import OverflowingContent from '../../../../../../../change.request/FBMaterialDisposition/components/commonCells/OveflowContent';
import { FormikField, TextField } from '../../../../../../../components/forms/fields-next';
import { CellTemplateProps } from '../../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { EDIT_FIELD } from '../constants';
import { LCP } from '../types';

const Editor: React.FC<CellTemplateProps<LCP>> = ({ dataItem, dataIndex, field, onChange }) => {
  const { getFieldProps, setFieldValue } = useFormikContext();

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (event) => {
    const value = event.target.value;
    if (dataItem.isAddPhase) {
      setFieldValue(field, value);
    }

    onChange?.({
      dataIndex,
      dataItem,
      syntheticEvent: event as unknown as React.SyntheticEvent,
      field,
      value,
    });
  };

  return (
    <FormikField
      name={field}
    >
      <TextField
        {...getFieldProps(field)}
        defaultValue={dataItem[field]}
        type="text"
        data-cy={`${kebabCase(field)}-field`}
        placeholder={translate('lhr.summary.placeholder.enter')}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};

export const LabelCell: React.FC<CellTemplateProps<LCP>> = (props) => {
  const { field, dataItem, onClick, colSpan, style, className } = props;
  const isEditMode = dataItem[EDIT_FIELD] || dataItem.isAddPhase;
  const handleClick = () => onClick?.({ dataItem });
  const dataCy = `${kebabCase(field)}-td`;

  return <td
    colSpan={colSpan}
    style={style}
    role="gridcell"
    className={className}
    data-cy={dataCy}
  >
    {isEditMode && <Editor {...props} />}
    {!isEditMode && <OverflowingContent onClick={handleClick} data-cy={dataCy}>
      {dataItem[field]}
    </OverflowingContent>}
  </td>;
};
