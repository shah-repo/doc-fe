import { Group } from '../../../../state/ducks/auth/types';
import { Employee } from '../../../../state/ducks/company/types';
import { POApprovalMatrixLevel, Signature } from '../FBPOApprovalMatrix.types';

export interface FBPOAMKendoTableProps {
  approvalLevels: POApprovalMatrixLevel[]
  signatureStages: number[]
  handleEdit: (index: number, item: POApprovalMatrixLevel) => void
  groups?: Map<string, Group>
  employees?: Map<string, Employee>
  disableFilter: boolean
  disabled?: boolean
  isDocumentReleased: boolean
}

interface GroupOrEmployee {
  id: string
  name: string
}

export interface SignatureWithStages extends Omit<Signature, 'groups' | 'employees'> {
  list: string
  groups: GroupOrEmployee[]
  employees: GroupOrEmployee[]
}

export interface POApprovalMatrixLevelItem extends POApprovalMatrixLevel {
  signatureStages: {
    [key: number]: SignatureWithStages
  }
}

export interface RowClickEvent {
  dataItem: POApprovalMatrixLevelItem
}
