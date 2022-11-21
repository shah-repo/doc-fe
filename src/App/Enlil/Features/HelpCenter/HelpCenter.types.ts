export enum HelpModule {
  General = "General",
  Dashboard = "Dashboard",
  DocumentList = "Document List",
  UserManagement = "User Management",
  GroupManagement = "Group Management",
  ApprovalRequests = "Change Orders",
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

interface HelpCenterItemData {
  type: HelpCenterItemType;
  title: string;
  url: string;
}

export interface HelpCenterHowToItemData extends HelpCenterItemData {
  type: HelpCenterItemType.HowTo;
}
export interface HelpCenterVideoItemData extends Partial<HelpCenterItemData> {
  type: HelpCenterItemType.Video;
  url: string;
}
export interface HelpCenterWorkflowItemData extends HelpCenterItemData {
  type: HelpCenterItemType.Workflow;
}

export type HelpCenterItems = HelpCenterHowToItemData | HelpCenterVideoItemData | HelpCenterWorkflowItemData;

export interface HelpCenterModuleData {
  title: string;
  url?: string;
  items: HelpCenterItems[];
}
