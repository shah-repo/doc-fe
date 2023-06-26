import { FBAutocompleteProps, FBInputProps, FBProcedureItemProps, FBProviderProps } from '..';
import { Nullable } from '../../../state/ducks/common/types';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';

export type FBLHRStepProps =
& Pick<FBProviderProps, 'lhrStepState'>
& Pick<FBInputProps, 'name' | 'label' | 'disabled' | 'index' | 'loading' | 'stepIndex' | 'gutter' | 'autosave'>
& Pick<FBProcedureItemProps, 'onClick' | 'dialogState'>
& Pick<FBAutocompleteProps, 'filterOptions'>
& {
  startMpi: () => void
  setDisplayToLHRs: () => void
  openLHRs: (docRev?: DocumentRevision) => void
  editorConfig: {
    value: string
  }
  isOutput: boolean
  stepLHRs?: Nullable<DocumentRevision>
  isDraft: boolean
  isPendingChange: boolean
  ownerOfStartMPIAction?: string
  ownerOfCompleteMPIAction?: string
  materials: any
  equipment: any
  isDocumentLHRT: boolean
  lhrBuildTypeExist: string
};

export interface StartMpiBody {
  wo: {
    id: string
  }
  mpi: {
    id: string
  }
  fieldId: string
  stepNumber?: number
}
