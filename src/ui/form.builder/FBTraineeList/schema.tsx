import { GridFilterCellProps } from '@progress/kendo-react-grid';
import React from 'react';
import { translate } from '../../../common/intl';
import { ColumnDefinition } from '../../components/KendoDataGrid/KendoDataGrid.types';
import DropdownFilter from '../FBApprovalMatrix/components/DropdownFilter';
import { createOption } from '../FBApprovalMatrix/components/Grid';
import InputFilter from '../FBApprovalMatrix/components/InputFilter';
import { ActionsCellTemplate } from './components/ActionsCellTemplate';
import { CommentsCellTemplate } from './components/CommentsCellTemplate';
import { DateCellTemplate } from './components/DateCellTemplate';
import { PrimaryOwnerCellTemplate } from './components/PrimaryOwnerCellTemplate';
import { RevisionCellTemplate } from './components/RevisionCellTemplate';
import { TrainingDocID } from './components/TrainingDocID';
import { TrainingTypeCellTemplate } from './components/TrainingTypeCellTemplate';
import { UploadEvidenceCellTemplate } from './components/UploadEvidenceCellTemplate';
import { DATE_FIELD, REFERENCE_FIELD, TRAINING_TYPE_OPTIONS } from './constants';
import { EditableTrainee, SchemaOptions } from './types';

export const buildSchema = ({
  primaryOwners,
  isActive,
  isInEditMode,
  actionsClass,
  onRowClick,
  onConfirm,
  onDiscard,
  onDelete,
  onPrimaryChange,
  records,
  isDisabled,
  currentState,
  employeeEvidenceUpdates,
}: SchemaOptions): Array<ColumnDefinition<EditableTrainee>> => {
  const primaryOwnerFieldOptions = primaryOwners.filter(item => item.active);
  const trainingTypeOptions = TRAINING_TYPE_OPTIONS.map((option) => createOption(option.value, option.label));
  const TrainingTypeFilter: React.FC<GridFilterCellProps> = (props) => (
    <DropdownFilter
      {...props}
      data={trainingTypeOptions}
      defaultItem={createOption(undefined, translate('common.all'))}
    />
  );

  return [
    {
      id: 'user',
      field: 'primaryOwner.user.name', // deep field name for correct filter working
      title: 'User',
      filterCell: InputFilter,
      template: (props) => <PrimaryOwnerCellTemplate {...props} field="primaryOwner" options={primaryOwnerFieldOptions} />,
      editable: false,
      width: 200,
    },
    {
      id: 'trDocId',
      field: 'trDocId',
      title: 'Training Doc ID',
      filterCell: InputFilter,
      template: TrainingDocID,
      width: 200,
    },
    {
      id: 'trainingType',
      field: 'trainingType',
      title: 'Training Type',
      filterCell: TrainingTypeFilter,
      template: TrainingTypeCellTemplate,
      width: 200,
    },
    {
      id: 'trId',
      field: 'trId',
      title: 'training.trn.id',
      filterCell: InputFilter,
      template: (props) => (
        <>trId</>
      ),
      width: 200,
    },
    {
      id: 'attachments',
      field: 'attachments',
      title: 'Attachments',
      show: false,
      template: (props) => <UploadEvidenceCellTemplate {...props} {...{ employeeEvidenceUpdates, isDisabled, currentState }} />,
      width: 324,
    },
    {
      id: 'reference',
      field: REFERENCE_FIELD,
      title: 'form.builder.training.reference',
      filterCell: InputFilter,
      template: (props) => <RevisionCellTemplate {...props} options={records} onClick={onRowClick} fieldToEdit="reference" />,
      width: 350,
    },
    {
      id: 'date',
      field: DATE_FIELD,
      title: 'form.builder.training.completion.date',
      filterCell: InputFilter,
      template: DateCellTemplate,
      width: 260,
    },
    {
      id: 'comments',
      field: 'comments',
      title: 'form.builder.training.comments',
      filterCell: InputFilter,
      template: (props) => <CommentsCellTemplate {...props} onClick={onRowClick} />,
      width: 250,
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
          onDelete={onDelete}
        />
      ),
      width: 1,
    },
  ];
};
