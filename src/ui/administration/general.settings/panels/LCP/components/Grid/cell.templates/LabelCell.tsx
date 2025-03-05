import { useFormikContext } from 'formik';
import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import OverflowingContent from '../../../../../../../change.request/FBMaterialDisposition/components/commonCells/OveflowContent';
import { FormikField, TextField } from '../../../../../../../components/forms/fields-next';
import { EDIT_FIELD } from '../constants';
import { CustomCellProps } from '../types';
import { getCellDataCyBasedOnParentDocType } from '../utils';

const Editor: React.FC<CustomCellProps> = ({ dataItem, partGroups, dataIndex, field, onChange }) => {
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
        data-cy={`${dataCy}field`}
        placeholder={translate('lhr.summary.placeholder.enter')}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};

export const LabelCell: React.FC<CustomCellProps> = (props) => {
  const { field, dataItem, onClick, colSpan, partGroups, style, className } = props;
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

  return <td
    colSpan={colSpan}
    style={style}
    role="gridcell"
    className={className}
    data-cy={`${dataCy}td`}
  >
    {isEditMode && <Editor {...props} />}
    {!isEditMode && <OverflowingContent onClick={handleClick} data-cy={`${dataCy}value`}>
      {dataItem[field]}
    </OverflowingContent>}
  </td>;
};
