import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { EditableSite, Site } from '../types';

export interface SchemaOptions {
  isActive: boolean
  isInEditMode: boolean
  actionsClass: string
  onConfirm?: () => void
  onDiscard?: () => void
  onDelete?: (dataItem: EditableSiteContact) => void
  onRowClick?: (e: SiteContactEditEvent) => void
  onPrimaryChange?: (id: string) => void
}

export interface SiteContactProps {
  dataItem: Site
  disabled?: boolean
  name: string
  sites: Site[]
  setSites: React.Dispatch<React.SetStateAction<EditableSite[]>>
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

export interface EditableSiteContact extends siteContact {
  [MODE_FIELD]: Mode
}

export interface SiteContactEditEvent {
  dataItem: EditableSiteContact
}

export interface CustomSiteContactTemplateProps extends CellTemplateProps<EditableSiteContact> {
  onClick?: (e: SiteContactEditEvent) => void
}
