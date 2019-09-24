import { store } from "react-easy-state";
import { FBStateInitialValues } from "./helpers";
import { FBStoreProps } from "./types";

const formBuilderStore: Pick<FBStoreProps, "state"> = store({
  state: FBStateInitialValues,
});

export default formBuilderStore;
