export enum HelpCenterItemType {
  Video = "VIDEO",
  Workflow = "WORKFLOW",
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
