import { Chip, CircularProgress } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import { ASLStatus } from '../../../administration/general.settings/panels/SupplierSettings/ASLStatus/types';
import { truncateByMaxChars } from '../../../components/common/header/Helpers';
import useStyles from '../../../components/common/kendo.column.templates/Status.styles';
import { EMPTY_VALUE_PLACEHOLDER, Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { ASL_STATUS_CLASS_MAPPING, MAX_ASL_STATUS_CHAR_LIMIT } from '../../FBProductOrService/constants';
import { CustomTemplateProps, EditableVendor } from '../types';

interface StatusChipProps {
  value: string
  onClick?: () => void
  supplierStatusId?: string
  approvedSupplierStatuses?: ASLStatus[]
}

const StatusChip: React.FC<StatusChipProps> = ({ value, onClick, supplierStatusId, approvedSupplierStatuses }) => {
  const classes = useStyles();
  const searchValue = supplierStatusId ?? value;
  const statusData = approvedSupplierStatuses?.find(data => data.displayLabel === searchValue);
  const label = statusData?.displayLabel ?? value;
  const statusClass = label ? (ASL_STATUS_CLASS_MAPPING[statusData?.internalType ?? ''] as keyof typeof classes) : '';
  const truncatedValue = truncateByMaxChars(label, MAX_ASL_STATUS_CHAR_LIMIT);
  const forceTooltip = label.length > MAX_ASL_STATUS_CHAR_LIMIT;

  return (
    <OverflowTooltip arrow placement="top" title={label} forceTooltip={forceTooltip}>
      <Chip
        size="small"
        className={cx(classes.chip, classes[statusClass], classes.aslChipTextOverflow)}
        label={truncatedValue}
      />
    </OverflowTooltip>
  );
};

const Editor: React.FC<CustomTemplateProps> = ({ dataItem, field, approvedSupplierStatuses }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values } = useFormikContext<EditableVendor>();

  const value = values?.vendor?.supplierStatusId ?? (dataItem?.[field] as string);

  if (!value) {
    return <>{EMPTY_VALUE_PLACEHOLDER}</>;
  }

  return <StatusChip value={value} supplierStatusId={values?.vendor?.supplierStatusId} approvedSupplierStatuses={approvedSupplierStatuses} />;
};

export const SupplierStateCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { field, dataItem, onClick, isLoading, approvedSupplierStatuses } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const value = (dataItem[field] as string);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  if (isLoading) {
    return <CircularProgress size={16} />;
  }

  if (!value) {
    return <>{EMPTY_VALUE_PLACEHOLDER}</>;
  }

  const handleClick = () => onClick?.({ dataItem });

  return <StatusChip value={value} approvedSupplierStatuses={approvedSupplierStatuses} onClick={handleClick} />;
};
