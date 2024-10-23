import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FBInputProps } from '../FBInput/FBInput.types';

export interface SchemaOptions {
  isActive: boolean
  isInEditMode: boolean
  actionsClass: string
  onConfirm?: () => void
  onDiscard?: () => void
  onDelete?: (dataItem: EditableSupplierContact) => void
  onRowClick?: (e: SupplierContactEditEvent) => void
  onPrimaryChange?: (id: string) => void
}

export type FBSupplierContactsProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>
& {
  contacts: SupplierContact[]
  deleteContact: (item: SupplierContact) => void
  updateContact: (item: SupplierContact, id?: string) => void
  setContacts: React.Dispatch<React.SetStateAction<SupplierContact[]>>
  setPrimaryContact: (id: string) => void
};

export interface SupplierContact {
  id: string
  isPrimary: boolean
  name: string
  title?: string
  email?: string
  phoneNumber?: string
  address?: string
  comments?: string
}

export interface siteContact {
  id: string
  primary: boolean
  shipping: boolean
  attention: boolean
  name: string
  email: string
  phoneNumber: string
  other: string
}

export interface SiteInformation {
  id: string
  siteName: string
  siteAddress: string
  city: string
  zipCode: string
  country: string
  approvedToReceive: string // Yes or No
  siteContact: siteContact[]

}

export interface EditableSiteContact extends siteContact {
  [MODE_FIELD]: Mode
}

export interface siteContactEditEvent {
  dataItem: EditableSupplierContact
}

export interface CustomSiteContactTemplateProps extends CellTemplateProps<EditableSiteContact> {
  onClick?: (e: siteContactEditEvent) => void
}

export interface EditableSiteInformation extends SiteInformation {
  [MODE_FIELD]: Mode
}

export interface EditableSiteContactEditEvent {
  dataItem: EditableSiteContact
}

export interface CustomSiteInformationTemplateProps extends CellTemplateProps<EditableSiteInformation> {
  onClick?: (e: EditableSiteContactEditEvent) => void
}

export interface EditableSupplierContact extends SupplierContact {
  [MODE_FIELD]: Mode
}

export interface SupplierContactEditEvent {
  dataItem: EditableSupplierContact
}

export interface CustomTemplateProps extends CellTemplateProps<EditableSupplierContact> {
  onClick?: (e: SupplierContactEditEvent) => void
}
