import { template } from "lodash";
import { FBApprovalsStatusEndpoint } from ".";
import { Approval } from "../../../state/ducks/common";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";


export class FBApprovalsState extends FBRequest<Approval, Approval> {
  public approvals?: Approval[];

  public constructor(approvals?: Approval[]) {
    super();
    this.approvals = approvals;
  }

  public setApprovals = (approvals?: Approval[]) => {
    this.approvals = approvals;
  };

  public getApproval = (id?: string): Approval | undefined => this.approvals?.find((approval) => approval.id === id);

  public addApproval = (approval: Approval) => {
    this.setUrl(FBEndpoint.Approvals);
    this.setBody(approval);
    this.post();
  };

  public setApprovalState = (approvalId: string, status: FBApprovalsStatusEndpoint) => {
    const urlTpl = template(FBEndpoint.SetApprovalStatus);
    const url = urlTpl({ approvalId, status });
    this.setUrl(url);
    this.post();
  };
}

export default FBApprovalsState;
