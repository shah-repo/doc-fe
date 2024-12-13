import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import {
  MODE_FIELD,
  Mode,
} from '../../../components/KendoDataGrid/constants';
import { Radio } from '../../../components/forms/fields-next';
import { CustomSiteTemplateProps, EditableSite } from '../types';
interface Props extends CustomSiteTemplateProps {
  isActive: boolean
  isInEditMode: boolean
  onPrimaryChange?: (id: string) => void
}

const Editor: React.FC<Props> = ({ field, dataIndex }) => {
  const { values, setFieldValue } = useFormikContext<EditableSite>();
  const [selected, setSelected] = useState(false);

  const handleChange = () => {
    setSelected((prevSelected) => !prevSelected);
    setFieldValue(field, !selected);
  };

  useEffect(() => {
    setSelected(values[field]);
  }, [values]);

  return (
    <Box display="flex" justifyContent="center" mt={0.75}>
      <Radio
        checked={selected}
        color="primary"
        size="small"
        name={`${field}-edit-${dataIndex}`}
        onClick={handleChange}
      />
    </Box>
  );
};

export const PrimaryCell: React.FC<Props> = (props) => {
  const { dataIndex, dataItem, isInEditMode, onPrimaryChange, field } = props;
  const isEditMode
    = dataItem[MODE_FIELD] === Mode.add || dataItem[MODE_FIELD] === Mode.edit;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isEditMode) {
      return;
    }
    const id = event.target.value;
    if (id && onPrimaryChange) {
      onPrimaryChange(id);
    }
  };
  if (isEditMode) {
    return <Editor {...props} />;
  }
  const shouldDisable = isInEditMode;
  return (
    <Box display="flex" justifyContent="center">
      <Radio
        checked={dataItem[field]}
        color="primary"
        size="small"
        value={dataItem.id}
        name={`${field}-${dataIndex}`}
        onChange={handleChange}
        disabled={shouldDisable}
      />
    </Box>
  );
};
