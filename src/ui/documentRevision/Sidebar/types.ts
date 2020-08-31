
export type SidebarType = "bookmarks" | "history" | "note" | "permissions";

export interface Sidebar {
  icon: JSX.Element;
  details: SidebarDetails;
  type: SidebarType;
}

export interface SidebarDetails {
  title: string;
  component: JSX.Element | null;
  dataCy?: string;
}
