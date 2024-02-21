import { GridFilterCellProps } from '@progress/kendo-react-grid';
import { uniq } from 'lodash';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { ColumnDefinition } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { UserAvatar } from '../../../../components/common/kendo.column.templates/UserAvatar';
import DropdownFilter from '../../../../form.builder/FBApprovalMatrix/components/DropdownFilter';
import { createOption } from '../../../../form.builder/FBApprovalMatrix/components/Grid';
import InputCellTemplateOrigin from '../../../../form.builder/FBApprovalMatrix/components/InputCellTemplate';
import InputFilter from '../../../../form.builder/FBApprovalMatrix/components/InputFilter';
import { ActionsCellTemplate } from './components/ActionsCellTemplate';
import IdCellTemplate from './components/IdCellTemplate';
import { PrimaryOwnerCellTemplate } from './components/PrimaryOwnerCellTemplate';
import { LocationCellTemplate } from './components/LocationCellTemplate';
import StatusCellTemplate from './components/StatusCellTemplate';
import { CustomTemplateProps, EditableRelatedEquipment, SchemaOptions } from './types';
import TextCellTemplate from './components/TextCellTemplate';

const InputCellTemplate = InputCellTemplateOrigin as React.FC<CustomTemplateProps>;

export const buildSchema = ({
  relatedEquipments,
  statuses,
  primaryOwners,
  locations,
  actionsClass,
  onConfirm,
  onDiscard,
}: SchemaOptions): Array<ColumnDefinition<EditableRelatedEquipment>> => {
  const statusOptions = statuses.map(status => createOption(status, translate(status)));
  const StatusFilter: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilter
      {...props}
      data={statusOptions}
      defaultItem={createOption(undefined, translate('common.all'))}
    />
  );

  const locationFieldOptions = locations.filter(location => location.active);
  const existingLocationIds = uniq(relatedEquipments.map(item => item.location?.id));
  const locationFilterOptions = locations
    .filter(location => existingLocationIds.includes(location.id))
    .map(location => createOption(location.id, location.name));
  const LocationFilter: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilter
      {...props}
      data={locationFilterOptions}
      defaultItem={createOption(undefined, translate('common.all'))}
    />
  );

  const primaryOwnerFieldOptions = primaryOwners.filter(item => item.active);

  return [
    {
      id: 'id',
      field: 'docId',
      title: 'common.id',
      filterCell: InputFilter,
      template: IdCellTemplate,
      editable: false,
      width: 155,
    },
    {
      id: 'revision',
      field: 'displayRevision',
      title: 'common.revision',
      filterCell: InputFilter,
      template: TextCellTemplate,
      editable: false,
      width: 90,
    },
    {
      id: 'name',
      field: 'name',
      title: 'common.title',
      filterCell: InputFilter,
      template: InputCellTemplate,
      editable: false,
      width: 200,
    },
    {
      id: 'status',
      field: 'status',
      title: 'common.status',
      filterCell: StatusFilter,
      template: StatusCellTemplate,
      editable: false,
      width: 135,
    },
    {
      id: 'createdBy',
      field: 'createdBy.name',
      title: 'common.createdBy',
      filterCell: InputFilter,
      cell: UserAvatar,
      editable: false,
      width: 200,
    },
    {
      id: 'owner',
      field: 'primaryOwner.user.name', // deep field name for correct filter working
      title: 'common.owner',
      filterCell: InputFilter,
      template: (props) => <PrimaryOwnerCellTemplate {...props} field="primaryOwner" options={primaryOwnerFieldOptions} />,
      editable: false,
      width: 200,
    },
    {
      id: 'location',
      field: 'location.id', // deep field name for correct filter working
      title: 'common.location',
      filterCell: LocationFilter,
      template: (props) => <LocationCellTemplate {...props} field="location" options={locationFieldOptions} />,
      editable: false,
      width: 200,
    },
    {
      id: 'actions',
      title: 'actions',
      className: actionsClass,
      template: (props) => (
        <ActionsCellTemplate
          {...props}
          onConfirm={onConfirm}
          onDiscard={onDiscard}
        />
      ),
      width: 1,
    },
  ];
};
