import { useFormikContext } from 'formik';
import { isNil, kebabCase } from 'lodash';
import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import OverflowingContent from '../../../../../../../change.request/FBMaterialDisposition/components/commonCells/OveflowContent';
import { Autocomplete, FormikField } from '../../../../../../../components/forms/fields-next';
import { CellTemplateProps } from '../../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { EDIT_FIELD } from '../constants';
import { LCP } from '../types';

const Editor: React.FC<CellTemplateProps<LCP>> = ({ dataItem, dataIndex, field, onChange }) => {
  const { getFieldProps, setFieldValue } = useFormikContext();

  const handleChange = (e, value: string) => {
    setFieldValue(field, value);
  };
  return (
    <FormikField
      name={field}
    >
      <Autocomplete
        {...getFieldProps(field)}
        blurOnSelect
        disableClearable
        placeholder={translate('common.select')}
        options={dataItem.enlilTypeOptions}
        data-cy={`${kebabCase(field)}-field`}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};

export const EnlilTypeCell: React.FC<CellTemplateProps<LCP>> = (props) => {
  const { field, dataItem, onClick, colSpan, style, className } = props;
  const isEditMode = dataItem[EDIT_FIELD] || dataItem.isAddPhase;
  const handleClick = () => onClick?.({ dataItem });
  const datCy = `${kebabCase(field)}-td`;

  return <td
    colSpan={colSpan}
    style={style}
    role="gridcell"
    className={className}
    data-cy={datCy}
  >
    {isEditMode && !isNil(dataItem.enlilTypeOptions) && <Editor {...props} />}
    { isNil(dataItem.enlilTypeOptions) && <OverflowingContent onClick={handleClick} data-cy={datCy}>
      {dataItem[field]}
    </OverflowingContent>}
  </td>;
};
