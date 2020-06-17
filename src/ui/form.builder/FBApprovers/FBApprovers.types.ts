import { Id } from "../../../state/ducks/common/types";
import { FBInputProps } from "../FBInput/FBInput.types";

export type FBApproversProps =
& Pick<FBInputProps, "disabled" | "name" >;

export interface Approvers {
  approvals: Approver[];
}

export interface Approver {
  id: Id;
}
