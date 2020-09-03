
export type SidebarType = "bookmarks" | "history" | "note" | "permissions" | "crHistory";

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
