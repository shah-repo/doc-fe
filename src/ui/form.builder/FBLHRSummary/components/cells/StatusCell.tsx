import { Chip } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { isEmpty, lowerCase } from 'lodash';
import React, { ChangeEvent, useEffect } from 'react';
import { translate } from '../../../../../common/intl';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import {
  MODE_FIELD,
  Mode,
} from '../../../../components/KendoDataGrid/constants';
import Tooltip from '../../../../components/common/kendo/Tooltip';
import { statusClassMapping } from '../../../../components/common/kendo/helpers';
import {
  Autocomplete,
  FormikField,
} from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import { EMPTY_PLACEHOLDER, STATUS_OPTIONS } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';
import { getLotStatus } from '../../utils';
import useStyles from './Status.styles';

type StatusCellProps = {lotDocs: DocumentRevision[]} & CustomTemplateProps;

const Editor: React.FC<StatusCellProps> = ({ field, lotDocs }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableLHRSummaryItem>();
  const { lotOrEquipment } = values ?? {};
  const status = getLotStatus(lotOrEquipment ?? '', lotDocs) ?? values[field];

  useEffect(() => {
    if (isEmpty(lotOrEquipment) || isEmpty(lotDocs)) {
      return;
    }

    setFieldValue(field, status);
  }, [values?.lotOrEquipment, lotDocs]);

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    // {id: 'enter value', revId: selectedValue, isNew: false}
    setFieldValue(field, value?.value ?? value);
  };

  const value = STATUS_OPTIONS.find((option) => option.value === lowerCase(status));

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        key={(isEmpty(values) || isEmpty(lotDocs) || isEmpty(status)) ? 'disabled' : 'enabled'}
        blurOnSelect
        freeSolo
        forcePopupIcon
        disableClearable
        options={STATUS_OPTIONS}
        value={value}
        getOptionLabel={(option: OptionType) => option.label}
        onChange={handleChange}
        placeholder={translate('lhr.summary.placeholder.select.enter')}
        size="small"
      />
    </FormikField>
  );
};

export const StatusCell: React.FC<StatusCellProps> = ({
  dataItem,
  field,
  lotDocs,
  ...props
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const classes = useStyles();

  const defaultValue = getLotStatus(dataItem?.lotOrEquipment ?? '', lotDocs) ?? dataItem[field];
  const value = STATUS_OPTIONS.find((option) => option.value === defaultValue);

  if (isEditMode) {
    return (
      <Editor {...props} {...{ dataItem, field, lotDocs }} />
    );
  }

  const displayStatus = value?.label ?? defaultValue;

  return (
    <>
      {displayStatus ? (
        <Tooltip
          data={displayStatus}
          childrenElement={
            <Chip
              size="small"
              className={cx(
                classes.chip,
                classes[statusClassMapping[displayStatus]],
              )}
              label={displayStatus}
            />
          }
        />
      ) : (
        EMPTY_PLACEHOLDER
      )}
    </>
  );
};
