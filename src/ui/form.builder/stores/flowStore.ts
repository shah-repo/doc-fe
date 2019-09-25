import { store } from "react-easy-state";
import { view } from "react-easy-state";
import { FBFlowStore } from "./utils/types";

const flowStore: FBFlowStore = store({
  mode: "view",
});

export {
  view,
  flowStore,
};
