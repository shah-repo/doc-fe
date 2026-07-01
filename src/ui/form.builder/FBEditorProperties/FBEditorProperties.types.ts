import { FBInputProps, FBOption } from '..';
import { DOC_TYPE_GROUP_OPTION, DocumentGroupOptionsType } from '../../../state/ducks/documentRevisions/documentType/types';

export type FBEditorPropertiesType =
| 'multiple'
| 'includeNone'
| 'includeContext'
| 'includeQRScan'
| 'reviseDisabled'
| 'approveIsBlocking'
| 'approvalNonVersioned'
| 'copyableValue'
| 'includeInInspection'
| 'includeInFaiInspection'
| 'deleteDisabled'
| 'includeNotes'
| 'defaultCurrentDate'
| 'disablePastDates';

export const editorPropertiesFlags: FBEditorPropertiesType[] = [
  'multiple',
  'includeNone',
  'includeContext',
  'includeQRScan',
  'reviseDisabled',
  'approveIsBlocking',
  'approvalNonVersioned',
  'copyableValue',
  'includeInInspection',
  'includeInFaiInspection',
  'deleteDisabled',
  'includeNotes',
  'defaultCurrentDate',
  'disablePastDates',
];

export const FBEditorPropertiesFormOutputOptions: FBEditorPropertiesType[] = [
  'multiple',
];

export type FBEditorPropertiesProps = Pick<FBInputProps, 'type' | 'options' | 'onChange'> & {
  inputProps?: Partial<FBInputProps>
  docGroupOptions?: DocumentGroupOptionsType[]
  isFormOutput?: boolean
};

export const FBEditorPropertiesOmitByGroup = {
  [DOC_TYPE_GROUP_OPTION.PART]: ['includeInInspection', 'includeInFaiInspection'],
};

export type FBEditorPropertiesOption =
& Pick<FBOption, 'text'>
& {
  value?: string
  outputText?: string // Option as FBOption label text
  isOption?: boolean // Whether the option will be treated as FBOption
};
