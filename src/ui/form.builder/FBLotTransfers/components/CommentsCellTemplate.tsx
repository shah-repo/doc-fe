import { Box } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import { translate } from '../../../../common/intl';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { FormikField, TextField } from '../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import useStyles from '../styles';
import { CustomTemplateProps, EditableLotTransfer } from '../types';

export const CommentsCellTemplate: React.FC<CustomTemplateProps> = ({ field, dataItem, onClick }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps } = useFormikContext<EditableLotTransfer>();
  const classes = useStyles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  const value = values.comments ?? '';

  if (isEditMode) {
    return (
      <FormikField
        name={field}
      >
        <TextField
          {...getFieldProps(field)}
          autosize
          size="small"
          inputProps={{
            rowsMax: 5,
          }}
          value={value}
          placeholder={translate('form.builder.lot.transfers.comments')}
        />
      </FormikField>
    );
  }

  const displayValue = dataItem.comments ?? EMPTY_VALUE_PLACEHOLDER;

  return (
    <Box onClick={() => onClick?.({ dataItem })}>
      <OverflowTooltip
        title={<div className={cx('containing-box-scrollbar', classes.tooltipContent)}>{displayValue}</div>}
        placement="top"
        interactive
        arrow
      >
        {displayValue}
      </OverflowTooltip>
    </Box>
  );
};
