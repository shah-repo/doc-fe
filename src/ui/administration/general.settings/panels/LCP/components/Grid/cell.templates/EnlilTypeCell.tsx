import { useFormikContext } from 'formik';
import { isNil } from 'lodash';
import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import OverflowingContent from '../../../../../../../change.request/FBMaterialDisposition/components/commonCells/OveflowContent';
import {
  Autocomplete,
  FormikField,
} from '../../../../../../../components/forms/fields-next';
import { EDIT_FIELD } from '../constants';
import { CustomCellProps } from '../types';
import { getCellDataCyBasedOnParentDocType } from '../utils';

const Editor: React.FC<CustomCellProps> = ({
  dataItem,
  dataIndex,
  field,
  partGroups,
  onChange,
}) => {
  const { getFieldProps, setFieldValue } = useFormikContext();
  const dataCy = React.useMemo(
    () =>
      getCellDataCyBasedOnParentDocType(
        partGroups,
        dataItem.documentTypeId,
        field,
        dataItem.internalType,
      ),
    [partGroups, dataItem, field],
  );

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
        options={dataItem.enlilTypeOptions}
        data-cy={`${dataCy}field`}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};

export const EnlilTypeCell: React.FC<CustomCellProps> = (props) => {
  const { field, dataItem, onClick, colSpan, style, className, partGroups } = props;
  const isEditMode = dataItem[EDIT_FIELD] || dataItem.isAddPhase;
  const handleClick = () => onClick?.({ dataItem });
  const dataCy = React.useMemo(
    () =>
      getCellDataCyBasedOnParentDocType(
        partGroups,
        dataItem.documentTypeId,
        field,
        dataItem.internalType,
      ),
    [partGroups, dataItem, field],
  );

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-cy={`${dataCy}td`}
    >
      {isEditMode && !isNil(dataItem.enlilTypeOptions) && <Editor {...props} />}
      {isNil(dataItem.enlilTypeOptions) && (
        <OverflowingContent onClick={handleClick} data-cy={`${dataCy}value`}>
          {dataItem[field]}
        </OverflowingContent>
      )}
    </td>
  );
};
