import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { OptionType } from '../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';

export interface AffectedSerialNumber {
  lotId: string
  serialNumbers: string[]
}

export interface EditableASN extends AffectedSerialNumber {
  [MODE_FIELD]: Mode
}

export interface ASNEditEvent {
  dataItem: EditableASN
}

export interface SchemaOptions {
  actionsClass: string
  onConfirm: () => void
  onDiscard: () => void
  onDelete?: () => void
  isDisabled: boolean
  lots: DocumentRevision[]
  isLotsloading: boolean
  onRowClick?: (e: ASNEditEvent) => void
}

export interface CustomTemplateProps extends CellTemplateProps<EditableASN> {
  onClick?: (e: ASNEditEvent) => void
  isDisabled?: boolean
  isClosed?: boolean
  serialNumbers?: OptionType[]
}

export type UseOptionsHook = () => {
  lots: DocumentRevision[]
  isLotsloading: boolean
};
