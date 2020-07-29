
export interface Sidebar {
  icon: JSX.Element;
  details: SidebarDetails;
}

export interface SidebarDetails {
  title: string;
  component: JSX.Element | null;
  dataCy?: string;
}
