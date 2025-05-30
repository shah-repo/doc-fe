import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { Radio } from '../../../components/forms/fields-next';
import { CustomTemplateProps, EditableSupplierContact } from '../types';

interface Props extends CustomTemplateProps {
  isActive: boolean
  isInEditMode: boolean
  onPrimaryChange?: (id: string) => void
}

const Editor: React.FC<Props> = ({ field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, setFieldValue } = useFormikContext<EditableSupplierContact>();
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(values.isPrimary);
  }, [values]);

  const handleChange = () => {
    setFieldValue(field, !selected);
    setSelected((prevSelected) => !prevSelected);
  };

  return (
    <Box display="flex" justifyContent="center" mt={0.75}>
      <Radio
        checked={selected}
        color="primary"
        size="small"
        value={values.id}
        onClick={handleChange}
      />
    </Box>
  );
};

export const PrimarySupplierCellTemplate: React.FC<Props> = (props) => {
  const { dataIndex, dataItem, isActive, isInEditMode, onPrimaryChange }
    = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(dataItem.isPrimary);
  }, [dataItem]);

  const handleChange = () => {
    if (!isEditMode) {
      onPrimaryChange?.(selected ? '' : dataItem.id);
      setSelected((prevSelected) => !prevSelected);
    }
  };

  if (isEditMode) {
    return <Editor {...props} />;
  }

  return (
    <Box display="flex" justifyContent="center">
      <Radio
        checked={selected}
        color="primary"
        size="small"
        value={dataItem.id}
        name={`primary-supplier-${dataIndex}`}
        onClick={handleChange}
        disabled={!isActive || isInEditMode}
      />
    </Box>
  );
};
