import { Nullable } from '../../../state/ducks/common/types';

type SidebarType = 'bookmarks' | 'history' | 'note' | 'permissions' | 'crHistory' | 'formMigration' | 'references';
export interface Sidebar {
  icon: JSX.Element
  details: SidebarDetails
  type: SidebarType
}
interface SidebarDetails {
  title: string
  component: Nullable<JSX.Element>
  dataCy?: string
  shouldShow?: boolean
  tooltip?: string
}
