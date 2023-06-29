import { FBInputProps } from '..';
import { Employee } from '../../../state/ducks/company/types';
import { DocumentRevision, DocumentRevisionDocument } from '../../../state/ducks/documentRevisions/types';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../components/KendoDataGrid/constants';

export interface CompanyLocation {
  id: string
  name: string
  active: boolean
}

type BuildOptionDocument = Pick<DocumentRevisionDocument, 'id' | 'docId'>;

export type BuildOption =
& Pick<DocumentRevision, 'id' | 'docId' | 'name' | 'status' | 'displayRevision'>
& {
  document: BuildOptionDocument
};

export type FBLotTransactionsProps =
& Pick<FBInputProps, 'name' | 'disabled'>
& {
  transfers?: LotTransfer[]
  locations?: CompanyLocation[]
  employees?: Employee[]
  builds?: BuildOption[]
  updateLotTransfer?: (transfer: LotTransfer) => void
  deleteLotTransfer?: (transfer: LotTransfer) => void
};

export enum LotTransferType {
  Allocate = 'allocate',
  Transfer = 'transfer',
  Return = 'return',
  Move = 'move',
}

export interface LotTransfer {
  id: string
  type: LotTransferType
  from: string
  to?: string
  build?: { id: string, docId: string }
  quantity: number
  date: string
  by: string
  comments?: string
}

export interface EditableLotTransfer extends LotTransfer {
  [MODE_FIELD]: Mode
}
export interface LotTranferEditEvent {
  dataItem: EditableLotTransfer
}

export type PredictFunction = (args: { skipTransfer?: LotTransfer, newTransfer?: LotTransfer }) => number;

export interface CustomTemplateProps extends CellTemplateProps<EditableLotTransfer> {
}
