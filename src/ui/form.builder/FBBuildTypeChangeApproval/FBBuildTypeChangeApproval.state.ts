import { filter, map, uniqBy } from 'lodash';
import { action, computed, observable, set } from 'mobx';
import { FBAutocompleteAsyncOption, FBAutocompleteAsyncState, FBRequestApprovalTransitionBody } from '..';
import { Document } from '../../../state/ducks/documentRevisions/types';
import { FBEndpoint } from '../defaults/FBEndpoint';
import FBRequest from '../FBApi/FBApi.request';
import { FBBuildTypeChangeApprovalBody, FBBuildTypeChangeApprovalConstructor, FBBuildTypeChangeApprovalOptions, FBBuildTypeChangeApprovalTransition, FBBuildTypeChangeApprovalTransitionBody } from './FBBuildTypeChangeApproval.types';

class FBBuildTypeChangeApprovalState {
  // MARK: @observables
  @observable public options?: FBBuildTypeChangeApprovalOptions[];
  @observable approvals?: FBBuildTypeChangeApprovalBody[];

  // MARK: @config
  private isOwner?: boolean;

  // MARK: @api
  public approversApi = new FBAutocompleteAsyncState({ optionId: FBAutocompleteAsyncOption.availableApprovers });
  public groupsApi = new FBAutocompleteAsyncState({ optionId: FBAutocompleteAsyncOption.groups });
  public rolesApi = new FBAutocompleteAsyncState({ optionId: FBAutocompleteAsyncOption.approvalRoles });
  public approvalApi = new FBRequest<FBBuildTypeChangeApprovalBody, Partial<FBBuildTypeChangeApprovalBody>>(FBEndpoint.Approvals);
  public transitionApi =
  new FBRequest<FBBuildTypeChangeApprovalBody, FBBuildTypeChangeApprovalTransitionBody | null>(FBEndpoint.ApprovalsTransition);

  public requestApprovalApi =
  new FBRequest<FBBuildTypeChangeApprovalBody[], FBRequestApprovalTransitionBody | null>(FBEndpoint.ApprovalsTransition);

  public documentApi: FBRequest<Document, null> = new FBRequest(FBEndpoint.Document);

  // MARK: @constructor
  public constructor (props: FBBuildTypeChangeApprovalConstructor) {
    this.initialApprovals(props);
  }

  // MARK: @computed
  @computed public get getApprovals (): FBBuildTypeChangeApprovalBody[] {
    const filtered = filter(this.approvals, (a) => a.status !== 'ABANDONED');
    return map(filtered, (a: FBBuildTypeChangeApprovalBody) => ({
      ...a,
      canRequest: this.isOwner && a.status === 'DRAFT',
    }));
  }

  @computed public get getOptions (): FBBuildTypeChangeApprovalOptions[] {
    return uniqBy(this.options, 'user.id');
  }

  // MARK: @actions
  @action public setOptions = (options?: FBBuildTypeChangeApprovalOptions[]) =>
    set(this, 'options', options);

  @action public setApprovals = (approvals?: FBBuildTypeChangeApprovalBody[]) =>
    set(this, 'approvals', approvals);

  // MARK: @helpers
  public initialApprovals = ({ approvals, isOwner }: FBBuildTypeChangeApprovalConstructor) => {
    approvals = filter(approvals, (a) => a.status !== 'ABANDONED');
    this.setApprovals(approvals);
    this.isOwner = isOwner;
    const approvers = map(approvals, 'approver');
    const options = map(approvers, (o) => ({ ...o, listGroup: 'Approvers' })) as FBBuildTypeChangeApprovalOptions[];
    this.setOptions(options);
  };

  public approvalBody = (
    body: Partial<FBBuildTypeChangeApprovalBody>,
    callback?: () => any,
  ) => {
    this.approvalApi.set({
      url: FBEndpoint.Approvals,
      body,
      method: 'post',
    }, (data, error) => {
      if (error) {
        this.approvalApi.onError(error);
      } else {
        this.approvalApi.data = data;
        this.approvalApi.onSuccess();
        callback?.();
      }
    });
  };

  public approvalTransition = (
    transition: FBBuildTypeChangeApprovalTransition,
    id?: string,
    body?: FBBuildTypeChangeApprovalTransitionBody,
    callback?: () => void,
  ) => {
    if (!id) { return; }
    this.transitionApi.set({
      body,
      url: FBEndpoint.ApprovalsTransition,
      urlValues: { id, transition },
      method: 'post',
    }, (data, error) => {
      if (error) {
        return this.transitionApi.onError(error);
      }
      this.transitionApi.data = data;
      this.transitionApi.onSuccess();
      callback?.();
    });
  };

  public requestApprovalTransition = (
    transition: FBBuildTypeChangeApprovalTransition,
    id: string,
    body: FBRequestApprovalTransitionBody,
    callback?: () => void,
  ) => this.requestApprovalApi.set({
    body,
    url: FBEndpoint.ApprovalsTransition,
    urlValues: { id, transition },
    method: 'post',
  }, (data, error) => {
    if (error) {
      return this.requestApprovalApi.onError(error);
    }
    this.requestApprovalApi.data = data;
    this.requestApprovalApi.onSuccess();
    callback?.();
  });

  public getDocument = (id?: string) => {
    if (!id) { return; }
    this.documentApi.set({
      url: FBEndpoint.Document,
      urlValues: { id },
      method: 'get',
    });
  };
}

export default FBBuildTypeChangeApprovalState;
