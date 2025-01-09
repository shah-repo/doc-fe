import { GridCellProps } from '@progress/kendo-react-grid';
import { filter, map } from 'lodash';
import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../common/intl';
import {
  Group,
  GroupTag,
  GroupType,
  Permission,
} from '../../../../state/ducks/auth/types';
import { Nullable } from '../../../../state/ducks/common/types';
import { userManagementSelectors } from '../../../../state/ducks/userManagement';
import ExpandableTemplate from '../../../components/common/kendo/ExpandableTemplate';
import { Autocomplete } from '../../../components/forms/fields-next';
import { AddUserManage } from '../types';
import useStyles from './styles';

interface GroupOptions {
  label: string
  text: string
  value: string
  tags: Nullable<GroupTag[]>
  type?: GroupType
  defaultForNewUsers: boolean
  permissions: Permission[]
  parents: Group[]
  joinedParents: Group[]
  isOfficial: boolean
}

interface GroupsProps extends GridCellProps {
  updatedGridData?: AddUserManage
}

export const GroupsCell = ({
  dataItem,
  rowType,
  colSpan,
  columnIndex,
  updatedGridData,
}: GroupsProps) => {
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const defaultGroups = useSelector(userManagementSelectors.getDefaultGroups);
  const classes = useStyles();
  const [result, setResult] = React.useState<GroupOptions[]>([]);
  const [data, setData] = React.useState<GroupOptions[]>([]);

  React.useEffect(() => {
    const upDatedGroupIds = map(updatedGridData?.groups, 'id');
    const selectedGroups = filter(groupOptions, (o) => upDatedGroupIds.includes(o.value));
    setData(groupOptions);
    if (selectedGroups.length) {
      setResult(selectedGroups as any);
    } else {
      setResult(defaultGroups);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupOptions, defaultGroups, dataItem.id]);

  const updateGroupField = (event: ChangeEvent<unknown>, value: GroupOptions[]) => {
    dataItem.groups = value.map((item) => ({
      id: item.value || '',
    }));
    setResult(value);
  };

  if (rowType === 'groupHeader') {
    return null;
  }

  return (
    <td
      id="kendo-expandable-column"
      colSpan={colSpan}
      role="gridcell"
      data-grid-col-index={columnIndex}
      className={classes.groupCell}
    >
      {dataItem.inEdit ? (
        <Autocomplete
          options={data}
          value={result}
          getOptionLabel={(option: GroupOptions) => option.label}
          defaultValue={defaultGroups}
          onChange={updateGroupField}
          placeholder={result.length ? undefined : translate('common.groups')}
          size="small"
          multiple
        />
      ) : (
        <ExpandableTemplate items={dataItem.groups.split(',')} dataId={`${dataItem.id}-${columnIndex}`} />
      )}
    </td>
  );
};
