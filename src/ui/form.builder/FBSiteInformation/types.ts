import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FBInputProps } from '../FBInput/FBInput.types';

export interface SchemaOptions {
  isActive: boolean
  isInEditMode: boolean
  actionsClass: string
  onConfirm?: () => void
  onDiscard?: () => void
  onDelete?: (dataItem: EditableSite) => void
  onRowClick?: (e: SiteEditEvent) => void
  onPrimaryChange?: (id: string) => void
}

export type FBSiteProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>
& {
  sites: Site[]
  deleteContact: (item: EditableSite) => void
  updateContact: (item: EditableSite, id?: string) => void
  setSites: React.Dispatch<React.SetStateAction<EditableSite[]>>
};

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

export interface Site {
  id: string
  sameAsHQ: boolean
  siteName: string
  siteAddress: string
  city: string
  zipCode: string
  country: string
  approvedToReceive: string
  siteContact: siteContact[]

}

export interface EditableSiteContact extends siteContact {
  [MODE_FIELD]: Mode
}

export interface SiteContactEditEvent {
  dataItem: EditableSiteContact
}

export interface CustomSiteContactTemplateProps extends CellTemplateProps<EditableSiteContact> {
  onClick?: (e: SiteContactEditEvent) => void
}

export interface EditableSite extends Site {
  [MODE_FIELD]: Mode
}

export interface SiteEditEvent {
  dataItem: EditableSite
}

export interface CustomSiteTemplateProps extends CellTemplateProps<EditableSite> {
  onClick?: (e: SiteEditEvent) => void
}
