import { HelpCenterItemType, HelpCenterModuleData, HelpModule } from "../HelpCenter.types";

const helpData: Partial<Record<HelpModule, HelpCenterModuleData>> = {
  [HelpModule.DocumentList]: {
    title: "Document Help",
    url: "//help.{env}enlil.io/document_help.html",
    items: [
      {
        type: HelpCenterItemType.HowTo,
        title: "How to create a document?",
        url: "//help.{env}enlil.io/document_how_to.html",
      },
      {
        type: HelpCenterItemType.Workflow,
        title: "Document Workflow",
        url: "//help.{env}enlil.io/document_workflow.html",
      },
    ],
  },
  [HelpModule.ApprovalRequests]: {
    title: "Change Order Help",
    url: "//help.{env}enlil.io/approval_request_help.html",
    items: [
      {
        type: HelpCenterItemType.HowTo,
        title: "How to create an Change Order?",
        url: "//help.{env}enlil.io/approval_request_how_to.html",
      },
      {
        type: HelpCenterItemType.Workflow,
        title: "Change Order Workflow",
        url: "//help.{env}enlil.io/approval_request_workflow.html",
      },
    ],
  },
  [HelpModule.Record]: {
    title: "Records Help",
    url: "//help.{env}enlil.io/record_help.html",
    items: [
      {
        type: HelpCenterItemType.HowTo,
        title: "How to create a record?",
        url: "//help.{env}enlil.io/record_how_to.html",
      },
      {
        type: HelpCenterItemType.Workflow,
        title: "Records Workflow",
        url: "//help.{env}enlil.io/record_workflow.html",
      },
    ],
  },
  [HelpModule.PurchaseOrder]: {
    title: "Purchase Order Help",
    url: "//help.{env}enlil.io/purchase_order_help.html",
    items: [
      {
        type: HelpCenterItemType.HowTo,
        title: "How to create a purchase order?",
        url: "//help.{env}enlil.io/purchase_order_how_to.html",
      },
      {
        type: HelpCenterItemType.Workflow,
        title: "Purchase Order Workflow",
        url: "//help.{env}enlil.io/purchase_order_workflow.html",
      },
    ],
  },
  [HelpModule.Equipment]: {
    title: "Equipment Help",
    url: "//help.{env}enlil.io/equipment_help.html",
    items: [
      {
        type: HelpCenterItemType.HowTo,
        title: "How to create an Equipment?",
        url: "//help.{env}enlil.io/equipment_how_to.html",
      },
      {
        type: HelpCenterItemType.Workflow,
        title: "Equipment Workflow",
        url: "//help.{env}enlil.io/equipment_workflow.html",
      },
    ],
  },
  [HelpModule.Supplier]: {
    title: "Supplier Help",
    url: "//help.{env}enlil.io/supplier_help.html",
    items: [
      {
        type: HelpCenterItemType.HowTo,
        title: "How to create a Supplier?",
        url: "//help.{env}enlil.io/supplier_how_to.html",
      },
      {
        type: HelpCenterItemType.Workflow,
        title: "Supplier Workflow",
        url: "//help.{env}enlil.io/supplier_workflow.html",
      },
    ],
  },
  [HelpModule.Receive]: {
    title: "Receiving Help",
    url: "//help.{env}enlil.io/receiving_help.html",
    items: [
      {
        type: HelpCenterItemType.HowTo,
        title: "How to create a Receiving record?",
        url: "//help.{env}enlil.io/receiving_how_to.html",
      },
      {
        type: HelpCenterItemType.Workflow,
        title: "Receiving Workflow",
        url: "//help.{env}enlil.io/receiving_workflow.html",
      },
    ],
  },
  [HelpModule.Parts]: {
    title: "Parts Help",
    url: "//help.{env}enlil.io/parts_help.html",
    items: [
      {
        type: HelpCenterItemType.HowTo,
        title: "How to create a Part?",
        url: "//help.{env}enlil.io/parts_how_to.html",
      },
      {
        type: HelpCenterItemType.Workflow,
        title: "Parts Workflow",
        url: "//help.{env}enlil.io/parts_workflow.html",
      },
    ],
  },
  [HelpModule.EB]: {
    title: "Engineering Build (EB) Help",
    url: "//help.{env}enlil.io/eb_help.html",
    items: [
      {
        type: HelpCenterItemType.HowTo,
        title: "How to create an EB?",
        url: "//help.{env}enlil.io/eb_how_to.html",
      },
      {
        type: HelpCenterItemType.Workflow,
        title: "Engineering Builds Workflow",
        url: "//help.{env}enlil.io/eb_workflow.html",
      },
    ],
  },
  [HelpModule.Lhr]: {
    title: "LHR Help",
    url: "//help.{env}enlil.io/lhr_help.html",
    items: [
      {
        type: HelpCenterItemType.HowTo,
        title: "How to create an LHR?",
        url: "//help.{env}enlil.io/lhr_how_to.html",
      },
      {
        type: HelpCenterItemType.Workflow,
        title: "LHR Workflow",
        url: "//help.{env}enlil.io/lhr_workflow.html",
      },
    ],
  },
  [HelpModule.Lot]: {
    title: "LOTs Help",
    url: "//help.{env}enlil.io/lots_help.html",
    items: [
      {
        type: HelpCenterItemType.HowTo,
        title: "How to create a LOT?",
        url: "//help.{env}enlil.io/lots_how_to.html",
      },
      {
        type: HelpCenterItemType.Workflow,
        title: "LOTs Workflow",
        url: "//help.{env}enlil.io/lots_workflow.html",
      },
    ],
  },
  [HelpModule.TrainingCurriculums]: {
    title: "Training Help",
    url: "//help.{env}enlil.io/training_help.html",
    items: [
      {
        type: HelpCenterItemType.HowTo,
        title: "How to create a Training Curriculum?",
        url: "//help.{env}enlil.io/training_how_to.html",
      },
      {
        type: HelpCenterItemType.Workflow,
        title: "Training Curriculum Workflow",
        url: "//help.{env}enlil.io/training_workflow.html",
      },
    ],
  },
  [HelpModule.UserManagement]: {
    title: "User Management Help",
    url: "//help.{env}enlil.io/user_mgmt_help.html",
    items: [
      {
        type: HelpCenterItemType.HowTo,
        title: "How to add Users?",
        url: "//help.{env}enlil.io/user_mgmt_how_to.html",
      },
      {
        type: HelpCenterItemType.Workflow,
        title: "User Addition workflow",
        url: "//help.{env}enlil.io/user_mgmt_workflow.html",
      },
    ],
  },
  [HelpModule.GroupManagement]: {
    title: "Group Management Help",
    url: "//help.{env}enlil.io/group_mgmt_help.html",
    items: [
      {
        type: HelpCenterItemType.HowTo,
        title: "How to create Groups?",
        url: "//help.{env}enlil.io/group_mgmt_how_to.html",
      },
      {
        type: HelpCenterItemType.Workflow,
        title: "Group Management Workflow",
        url: "//help.{env}enlil.io/group_mgmt_workflow.html",
      },
    ],
  },
  [HelpModule.Dashboard]: {
    title: "Dashboard Help",
    url: "//help.{env}enlil.io/dashboard_help.html",
    items: [
      {
        type: HelpCenterItemType.HowTo,
        title: "How to navigate through the Dashboard as a regular user",
        url: "//help.{env}enlil.io/dashboard_how_to.html",
      },
      {
        type: HelpCenterItemType.Workflow,
        title: "Dashboard Navigator",
        url: "//help.{env}enlil.io/dashboard_workflow.html",
      },
    ],
  },
};

export default helpData;
