import { useFormikContext } from 'formik';
import { kebabCase } from 'lodash';
import React from 'react';
import { translate } from '../../../../common/intl';
import {
  Autocomplete,
  FormikField,
} from '../../../components/forms/fields-next';
import {
  MODE_FIELD,
  Mode,
} from '../../../components/KendoDataGrid/constants';
import { APPROVED_TO_RECEIVE_OPTIONS } from '../constants';
import { CustomSiteTemplateProps } from '../types';
const Editor: React.FC<CustomSiteTemplateProps> = ({
  dataItem,
  dataIndex,
  field,
  onChange,
}) => {
  const { getFieldProps, setFieldValue } = useFormikContext();
  const handleChange = (e, value: string) => {
    setFieldValue(field, value);
    onChange?.({
      dataIndex,
      dataItem,
      syntheticEvent: e.syntheticEvent,
      field,
      value,
    });
  };
  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        blurOnSelect
        disableClearable
        placeholder={translate('common.select')}
        options={APPROVED_TO_RECEIVE_OPTIONS}
        data-cy={`${kebabCase(field)}-field`}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};
export const ApprovedToReceiveCell: React.FC<CustomSiteTemplateProps> = (props) => {
  const { field, dataItem, onClick, colSpan, style, className } = props;
  const isEditMode
    = dataItem[MODE_FIELD] === Mode.add || dataItem[MODE_FIELD] === Mode.edit;
  const handleClick = () => onClick?.({ dataItem });
  const dataCy = `${kebabCase(field)}-td`;
  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-cy={dataCy}
    >
      {isEditMode && <Editor {...props} />}
      {!isEditMode && (
        <span onClick={handleClick} data-cy={dataCy}>
          {dataItem[field]}
        </span>
      )}
    </td>
  );
};
