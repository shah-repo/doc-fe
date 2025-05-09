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

export interface IAnnouncement {
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

export interface IAnnouncementDetail {
  announcementId: string
  helpText: string
  componentKeyName: string
  displayOrder: number
  formBuilder: IFormBuilder
  id: string
}

export interface IFormBuilder {
  dataType: FormBuilderComponentTypeEnum
  defaultLabel: string
  defaultTabId: string
  describingText: string
  fieldNames: string[]
  keyName: string
  optionId: string
  options: Array<{text: string, value: string}>
  type: string
}

export type IConflictingItem = FBSchemaProps & {
  isResolved?: boolean
  isSelected?: boolean
  mustBeResolved?: boolean
};

export enum IndicatorTypeEnum {
  INFO = 'info',
  WARNING = 'warning',
}

export enum SELECTED_RESOLUTION_ENUM {
  EXISTING = 'existing',
  NEW = 'new',
}
