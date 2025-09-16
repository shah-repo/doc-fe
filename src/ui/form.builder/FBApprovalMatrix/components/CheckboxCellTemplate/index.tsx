import { Tooltip } from '@material-ui/core';
import { Checkbox, CheckboxProps } from '@progress/kendo-react-inputs';
import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { CellTemplate } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { FBApprovalRole } from '../../../FBApprovalMatrixField/FBApprovalMatrixField.types';
import { MODE_FIELD, Mode } from '../Grid';

const CheckboxCellTemplate: CellTemplate = (props) => {
  const { dataItem, field, dataIndex, column, onChange } = props;
  const { editable } = column;

  const isRoleCheckbox = Boolean(get(column, 'isRoleCheckbox', false));
  const role = get(column, 'role', {}) as Partial<FBApprovalRole>;

  const mode = get(dataItem, MODE_FIELD);
  const path = field ?? '';
  const value = Boolean(get(dataItem, path));

  const isRoleHasGroups = role.groups?.length && role.groups.length > 0;
  const canBeModified = (Boolean(editable) && mode === Mode.edit) || mode === Mode.add;
  const isRoleCheckboxDisabled = isRoleCheckbox && !isRoleHasGroups;

  const handleChange: CheckboxProps['onChange'] = (event) => {
    onChange?.({
      dataIndex,
      dataItem,
      syntheticEvent: event.syntheticEvent,
      field,
      value: event.value,
    });
  };

  return (
    <Tooltip
      title={
        canBeModified && isRoleCheckboxDisabled
          ? translate('form.builder.approvalRoles.no.groups')
          : ''
      }
      placement="top"
      arrow
    >
      <div>
        <Checkbox
          defaultValue={value}
          disabled={!canBeModified || isRoleCheckboxDisabled}
          onChange={handleChange}
        />
      </div>
    </Tooltip>
  );
};

export default CheckboxCellTemplate;
