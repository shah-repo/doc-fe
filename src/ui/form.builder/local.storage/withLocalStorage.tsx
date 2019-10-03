import _ from "lodash";
import React from "react";
import { DocumentRevisionType } from "../../../state/ducks/documentRevisions";
import { Subtract } from "../types/common";
import { FBFlowStore, FBTemplateStore } from "../types/store";
import { FBLocalStorageProps } from "./utils/types";

// *NOTE: for POC only; this will be removed
// export function withLocalStorage<T extends FBLocalStorageProps>(
//   Component: React.ComponentType<T>,
// ) {

//   return class extends React.Component<Subtract<T, FBLocalStorageProps>> {

//     public render() {
//       return (
//         <Component
//           {...this.props as T}
//           templateSubmit={this.templateSubmit}
//           getTemplates={this.getTemplates}
//           valuesSubmit={this.valuesSubmit}
//           getValue={this.getValue}
//         />
//       );
//     }

//     private getTpls = (): FBTemplateStore[] => {
//       const tplStr = localStorage.getItem("fbTemplates");
//       const templates = tplStr ? JSON.parse(tplStr) : [];
//       return templates;
//     }

//     private getValues = (filtered: boolean = false): FBFlowStore[] => {
//       const valuesStr = localStorage.getItem("fbValues");
//       const values = valuesStr ? JSON.parse(valuesStr) : [];
//       if (filtered) {
//         return _.filter(values, (value) => value.documentId === flowStore.documentId);
//       }
//       return _.filter(values, (value) => value.documentId !== flowStore.documentId);
//     }

//     private getTemplates = (by: DocumentRevisionType | string): FBTemplateStore[] => {
//       const templates = this.getTpls();

//       if (by as DocumentRevisionType) {
//         return _.filter(templates, (template) => template.documentType === by);
//       } else {
//         return _.filter(templates, (template) => template.name === by);
//       }
//     }

//     private getTemplate = (byName: string): FBTemplateStore => {
//       const templates = this.getTemplates(byName);
//       return templates[0];
//     }

//     private templateSubmit = () => {
//       const templates = this.getTpls();
//       const filtered = _.filter(templates, (template) => template.name === templateStore.name);
//       if (filtered.length > 0) {
//         return false;
//       }
//       templates.push(templateStore);
//       localStorage.setItem("fbTemplates", JSON.stringify(templates));
//     }

//     private valuesSubmit = () => {
//       if (!flowStore.documentId) { return; }
//       const values = this.getValues();
//       flowStore.templateName = templateStore.name;
//       values.push(flowStore);
//       localStorage.setItem("fbValues", JSON.stringify(values));
//     }

//     private getValue = () => {
//       const values = this.getValues(true);
//       if (values[0] && flowStore.templateName) {
//         templateStore.setState(this.getTemplate(flowStore.templateName));
//         flowStore.setState(values[0]);
//       }
//     }
//   };
// }
