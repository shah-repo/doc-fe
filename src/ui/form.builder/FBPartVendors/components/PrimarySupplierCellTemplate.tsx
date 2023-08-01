import { Box, Radio } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { CustomTemplateProps, EditableVendor } from '../types';

interface Props extends CustomTemplateProps {
  setPrimaryVendor?: (id: string) => void
  isActive: boolean
  isInEditMode: boolean
}

const Editor: React.FC<Props> = ({ field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, setFieldValue } = useFormikContext<EditableVendor>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(field, true);
  };

  return (
    <Box display="flex" justifyContent="center">
      <Radio
        checked={values.primary}
        color="primary"
        size="small"
        value={values.id}
        onChange={handleChange}
      />
    </Box>
  );
};

export const PrimarySupplierCellTemplate: React.FC<Props> = (props) => {
  const { dataIndex, dataItem, isActive, isInEditMode, setPrimaryVendor } = props;
  const isEditMode = dataItem[MODE_FIELD] === Mode.add || dataItem[MODE_FIELD] === Mode.edit;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isEditMode) {
      return;
    }
    const id = event.target.value;
    if (id && setPrimaryVendor) {
      setPrimaryVendor(id);
    }
  };

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const shouldDisable = !isActive || isInEditMode;

  return (
    <Box display="flex" justifyContent="center">
      <Radio
        checked={dataItem.primary}
        color="primary"
        size="small"
        value={dataItem.id}
        name={`primary-supplier-${dataIndex}`}
        onChange={handleChange}
        disabled={shouldDisable}
      />
    </Box>
  );
};
