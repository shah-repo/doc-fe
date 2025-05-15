import { DocumentCategory } from '../../../state/ducks/documentRevisions/types';
import { FBSchemaProps } from '../../form.builder';

export enum AnnouncementTypeEnum {
  INFO = 'INFO',
  FORM_UPGRADE = 'FORM_UPGRADE',
}

enum AnnouncementStatusEnum {
  REGISTERED = 'REGISTERED',
  FORM_REVISION_CREATED = 'FORM_REVISION_CREATED',
  VIEWED = 'VIEWED',
  COMPLETED = 'COMPLETED',
}

enum FormBuilderComponentTypeEnum {
  PRIMITIVE = 'PRIMITIVE',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
}

export interface Announcement {
  companyId: string
  completedAt: string
  documentTypeCategory: DocumentCategory
  documentTypeId: string
  id: string
  name: string
  text: string
  type: AnnouncementTypeEnum
  status: AnnouncementStatusEnum
  canUpgradeForm: boolean
  isMappingRequired: boolean
}

export interface AnnouncementRowDetail {
  announcementId: string
  helpText: string
  componentKeyName: string
  displayOrder: number
  formBuilder: FormComponent
  id: string
}

interface Option {
  text: string
  value: string
}

export interface FormComponent {
  dataType: FormBuilderComponentTypeEnum
  defaultLabel: string
  defaultTabId: string
  describingText: string
  fieldNames: string[]
  keyName: string
  optionId: string
  options: Option[]
  type: string
}

export type ConflictItem = FBSchemaProps & {
  isResolved?: boolean
  isSelected?: boolean
  mustBeResolved?: boolean
};

export enum IndicatorTypeEnum {
  INFO = 'info',
  WARNING = 'warning',
}

export enum SelectedResolution {
  EXISTING = 'existing',
  NEW = 'new',
}
