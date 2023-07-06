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

type Document = Pick<DocumentRevisionDocument, 'id' | 'docId'>;

export type DocumentRevisionOption =
& Pick<DocumentRevision, 'id' | 'docId' | 'name' | 'status' | 'displayRevision'>
& {
  document: Document
};

export type FBLotTransactionsProps =
& Pick<FBInputProps, 'name' | 'disabled'>
& {
  transfers: LotTransfer[]
  locations: CompanyLocation[]
  employees: Employee[]
  builds: DocumentRevisionOption[]
  records: DocumentRevisionOption[]
  updateLotTransfer: (transfer: LotTransfer) => void
  deleteLotTransfer: (transfer: LotTransfer) => void
};

export enum LotTransferType {
  Allocate = 'allocate',
  Transfer = 'transfer',
  Return = 'return',
  Move = 'move',
  Issue = 'issue',
}

export interface LotTransfer {
  id: string
  type: LotTransferType
  from: string
  to?: string
  build?: { id: string, docId: string }
  reference?: { id: string, docId: string }
  quantity: number
  date: string
  by: string
  comments?: string
}

export interface EditableLotTransfer extends LotTransfer {
  [MODE_FIELD]: Mode
}
export type DraftLotTransfer = Partial<EditableLotTransfer>;
export type CalculableLotTransfer = Pick<LotTransfer, 'type' | 'quantity'>;

export interface LotTranferEditEvent {
  dataItem: EditableLotTransfer
}

export type PredictQuantityFunction = (args: { skipTransfer?: DraftLotTransfer, newTransfer?: CalculableLotTransfer }) => number;

export interface CustomTemplateProps extends CellTemplateProps<EditableLotTransfer> {
  onClick?: (e: LotTranferEditEvent) => void
}
