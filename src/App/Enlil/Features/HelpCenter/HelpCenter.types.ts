export enum HelpModule {
  FAQ = "FAQ",
  General = "General",
  Dashboard = "Dashboard",
  ReleaseNotes = "Release Notes",
  DocumentList = "Document List",
  UserManagement = "User Management",
  GroupManagement = "Group Management",
  ApprovalRequests = "Approval Requests",
  EB = "EB",
  Lhr = "Lhr",
  Lot = "Lot",
  Parts = "Parts",
  Record = "Record",
  Receive = "Receive",
  Supplier = "Supplier",
  Training = "Training",
  Equipment = "Equipment",
  WorkOrder = "Work Order",
  PurchaseOrder = "Purchase Order",
  TrainingCurriculums = "Training Curriculums",
}

export enum HelpCenterItemType {
  HowTo = "HOWTO",
  Video = "VIDEO",
  Workflow = "WORKFLOW",
}

export interface HelpCenterItemData {
  type: HelpCenterItemType;
  title: string;
  url: string;
}


export interface HelpCenterHowToItemData extends HelpCenterItemData {
  type: HelpCenterItemType.HowTo;
}
export interface HelpCenterVideoItemData extends Partial<HelpCenterItemData> {
  type: HelpCenterItemType.Video;
  videoId: string;
}
export interface HelpCenterWorkflowItemData extends HelpCenterItemData {
  type: HelpCenterItemType.Workflow;
}

export interface HelpCenterModuleData {
  title: string;
  url?: string;
  items: HelpCenterItemData[];
}
