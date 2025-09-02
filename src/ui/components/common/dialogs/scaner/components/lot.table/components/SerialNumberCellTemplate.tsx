import { useFormikContext } from 'formik';
import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import { FormikField, TextField } from '../../../../../../forms/fields-next';
import { CustomTemplateProps } from '../types';

const Editor: React.FC<CustomTemplateProps> = ({ field, dataItem, updateScanLot }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps } = useFormikContext();

  const onChange = (value) => {
    console.log('value', value);
    const dataItem1 = {
      ...dataItem,
      [field]: value,
    };

    updateScanLot?.(dataItem1);
  };

  return (
    <FormikField
      name={field}
    >
      <TextField
        {...getFieldProps(field)}
        defaultValue={undefined}
        placeholder={translate('common.scan')}
        type="text"
        onChange={onChange}
        size="small"
      />
    </FormikField>
  );
};

export const SerialNumberCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  // const { dataItem, field, onClick } = props;
  // const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  // if (isEditMode) {
  return <Editor {...props} />;
  // }

  // const handleClick = () => onClick?.({ dataItem });
  // const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;

  // return (
  //   <OverflowContent onClick={handleClick}>
  //     {displayValue}
  //   </OverflowContent>
  // );
};
