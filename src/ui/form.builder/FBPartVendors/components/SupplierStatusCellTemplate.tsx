import { Box, Chip } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { styles as useStyles } from '../../../components/common/kendo.column.templates/Status.styles';
import { statusClassMapping } from '../../../components/common/kendo/helpers';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps, EditableVendor } from '../types';

interface StatusChipProps {
  value: string
  onClick?: () => void
}

const StatusChip: React.FC<StatusChipProps> = ({ value, onClick }) => {
  const classes = useStyles();
  const statusClass = value ? statusClassMapping[value] as keyof typeof classes : '';

  return (
    <Box className={classes.wrapper} onClick={onClick}>
      <Chip
        size="small"
        className={cx(classes.chip, classes[statusClass])}
        label={value}
      />
    </Box>
  );
};

const Editor: React.FC<CustomTemplateProps> = ({ dataItem, field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values } = useFormikContext<EditableVendor>();

  const value = values?.vendor?.displayStatus ?? dataItem?.[field] as string;

  if (!value) {
    return <>{EMPTY_VALUE_PLACEHOLDER}</>;
  }

  return <StatusChip value={value} />;
};

export const SupplierStatusCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { field, dataItem, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const value = dataItem[field] as string;

  if (!value) {
    return <>{EMPTY_VALUE_PLACEHOLDER}</>;
  }

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });

  return <StatusChip value={value} onClick={handleClick} />;
};
