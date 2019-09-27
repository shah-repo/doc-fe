import _ from "lodash";
import { store } from "react-easy-state";
import { view } from "react-easy-state";
import { FBFlowStore } from "./utils/types";

const flowStore: FBFlowStore = store({
  mode: "view",
  documentId: undefined,
  documentType: undefined,
  templateName:  "",
  submitLabel: "Create",
  values: {},

  setState: (values: FBFlowStore) => _.merge(flowStore, values),
});

export {
  view,
  flowStore,
};
