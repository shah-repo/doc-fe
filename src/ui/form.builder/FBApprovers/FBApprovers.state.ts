import { isEmpty, map } from "lodash";
import { action, observable, set } from "mobx";
import { FBApproversBody, FBApproversConstructor, FBJoinedEmployee, FBRequiredApprover } from "..";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

export class FBApproversState extends FBRequest<FBRequiredApprover[], FBApproversBody> {

  @observable public groups?: Record<string, FBRequiredApprover> = {};
  @observable public value?: string[];
  public url = FBEndpoint.RequiredApprovers;

  public constructor({ documentRevisions, formValue }: FBApproversConstructor) {
    super();
    this.value = formValue;
    this.fetchRequiredApprovers(documentRevisions);
  }

  public fetchRequiredApprovers = (documentRevisions: string[] = []) => {
    if (isEmpty(documentRevisions)) {
      this.groups = {};
      return;
    }
    this.setBody({ ids: documentRevisions });
    this.fetch();
  };

  @action public prepareData = (data: FBRequiredApprover[]): FBRequiredApprover[] | undefined => {
    this.groups = (data || []).reduce((group, item) => {
      group[item.id] = {
        ...item,
        joinedEmployees: map(item.joinedEmployees as FBJoinedEmployee[], "id"),
      };
      return group;
    }, {});
    return data;
  };

  @action setValue = (value: string[]) =>
    set(this, "value", value);
}

export default FBApproversState;
