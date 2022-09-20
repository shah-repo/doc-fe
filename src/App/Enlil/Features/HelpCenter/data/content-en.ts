import { HelpCenterItemType, HelpModule } from "../HelpCenter.types";

export default {
  [HelpModule.ApprovalRequests]: {
    title: "Approval Request Help",
    items: [
      {
        type: HelpCenterItemType.Video,
        title: "How to create an Approval Request?",
        videoId: "-ZtYP4oDwWY",
      },
      {
        type: HelpCenterItemType.Video,
        title: "How to create an Express Approval Request",
        videoId: "-ZtYP4oDwWY",
      },
      {
        type: HelpCenterItemType.Workflow,
        title: "Approval Request Workflow",
        url: "//help.dev.enlil.io/article_page_pdf.html",
      },
      {
        type: HelpCenterItemType.Workflow,
        title: "Express Approval Request Workflow",
        url: "//help.dev.enlil.io/article_page_pdf.html",
      },
    ],
  },
};
