import { DocumentCategory } from '../../../state/ducks/documentRevisions/types';

export enum ANNOUNCEMENT_TYPE_ENUM {
  INFO = 'INFO',
  FORM_UPGRADE = 'FORM_UPGRADE',
}

export enum FORM_BUILDER_COMPONENT_TYPE_ENUM {
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
  type: ANNOUNCEMENT_TYPE_ENUM
  canUpgradeForm: boolean
}

export interface IAnnouncementDetail {
  announcementId: string
  beforeText: string
  componentKeyName: string
  displayOrder: number
  formBuilder: IFormBuilder
  id: string
}

export interface IFormBuilder {
  dataType: FORM_BUILDER_COMPONENT_TYPE_ENUM
  defaultLabel: string
  describingText: string
  fieldNames: string[]
  keyName: string
  optionId: string
  options: string[]
  type: string
}
