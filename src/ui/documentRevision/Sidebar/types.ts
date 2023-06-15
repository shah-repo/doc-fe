export type SidebarType = 'bookmarks' | 'history' | 'note' | 'permissions' | 'crHistory' | 'formMigration' | 'references';

export interface Sidebar {
  icon: JSX.Element
  details: SidebarDetails
  type: SidebarType
}

interface SidebarDetails {
  title: string
  component: JSX.Element | null
  dataCy?: string
  shouldShow?: boolean
}
