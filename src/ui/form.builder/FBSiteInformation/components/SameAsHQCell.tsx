import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React from 'react';
import SwitchControl from '../../../administration/general.settings/components/SwitchControl';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { CustomTemplateProps, EditableSupplierContact } from '../types';
import styles from './styles';

interface Props extends CustomTemplateProps {
  isActive: boolean
  isInEditMode: boolean
  onPrimaryChange?: (id: string) => void
}

const Editor: React.FC<Props> = ({ field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, setFieldValue } = useFormikContext<EditableSupplierContact>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(field, true);
  };

  return (
    <Box display="flex" justifyContent="center" mt={0.75}>
      <SwitchControl
        checked={values.isPrimary}
        onChange={handleChange}
        label="" />
    </Box>
  );
};

export const SameAsHQCellCellTemplate: React.FC<Props> = (props) => {
  const classes = styles();
  const { dataIndex, dataItem, isActive, isInEditMode, onPrimaryChange } = props;
  const isEditMode = dataItem[MODE_FIELD] === Mode.add || dataItem[MODE_FIELD] === Mode.edit;

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

  const shouldDisable = !isActive || isInEditMode;

  return (
    <Box display="flex" justifyContent="center">
      <SwitchControl
        checked={dataItem.isPrimary}
        onChange={handleChange}
        classes={{ root: classes.root }}
        name={`primary-supplier-${dataIndex}`}
        disabled={shouldDisable}
        label=""
      />
    </Box>
  );
};
