import { Attachment } from '../../../state/ducks/attachments/types';
import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FBInputProps } from '../FBInput/FBInput.types';

export interface SchemaOptions {
  isActive: boolean
  isInEditMode: boolean
  actionsClass: string
  onConfirm?: () => void
  onDiscard?: () => void
  onDelete?: (dataItem: EditableCertification) => void
  onRowClick?: (e: CertificationEditEvent) => void
}

export type FBCertificationProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>
& {
  certifications: Certification[]
  setCertifications: React.Dispatch<React.SetStateAction<Certification[]>>
};

export interface Certification {
  id: string
  certificateId?: string
  phoneNumber?: string
  attachments: Attachment[]
  uploadedBy: string
  expiryDate: string
}

export interface EditableCertification extends Certification {
  [MODE_FIELD]: Mode
}

export interface CertificationEditEvent {
  dataItem: EditableCertification
}

export interface CustomTemplateProps extends CellTemplateProps<EditableCertification> {
  onClick?: (e: CertificationEditEvent) => void
}
