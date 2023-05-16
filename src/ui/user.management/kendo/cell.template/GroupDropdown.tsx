import { GridFilterCellProps } from '@progress/kendo-react-grid';
import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { userManagementSelectors } from '../../../../state/ducks/userManagement';
import { DisplayText, TranslatedText } from '../../../components/common/kendo/helpers';
import { DropdownFilterCell } from './DropdownFilterCell';

export const GroupDropdown = (props: GridFilterCellProps) => {
  const intl = useIntl();
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);

  return (
    <DropdownFilterCell
      {...props}
      data={groupOptions.map((col) => col.text)}
      defaultItem={intl.formatMessage({
        id: TranslatedText[DisplayText.SELECT_GROUPS],
      })}
    />
  );
};
