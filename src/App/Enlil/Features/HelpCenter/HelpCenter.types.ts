export enum HelpCenterItemType {
  Video = "VIDEO",
  Workflow = "WORKFLOW",
}

export enum AppModules {
  DocumentList = "Document List",
  ApprovalRequest = "Approval Request",
  Records = "Records",
  PurchaseOrders = "Purchase Orders",
  Equipment = "Equipment",
  Suppliers = "Suppliers",
  Receiving = "Receiving",
  Parts = "Parts",
  EngineeringBuilds = "Engineering Builds",
  LHR = "LHR",
  LOTs = "LOTs",
  Training = "Training",
  UserManagement = "User Management",
  GroupManagement = "Group Management",
  Dashboard = "Dashboard",
}

interface IHelpCenterItemData {
  type: HelpCenterItemType;
  title: string;
  url: string;
}

export type HelpCenterVideoItemData = IHelpCenterItemData & {
  type: HelpCenterItemType.Video;
  videoId: string;
};

export type HelpCenterWorkflowItemData = IHelpCenterItemData & {
  type: HelpCenterItemType.Workflow;
};

export interface IHelpCenterModuleData {
  title: string;
  items: IHelpCenterItemData[];
}
