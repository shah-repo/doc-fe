import { filter, map } from 'lodash';
import { action, computed, observable, reaction, set } from 'mobx';
import { FBAutocompleteAsyncOption, FBInlineApprovalBody, FBInlineApprovalTransition, FBInlineApprovalTransitionBody } from '..';
import { LHRBuild } from '../../administration/general.settings/panels/LHRBuild/types';
import { FBEndpoint } from '../defaults/FBEndpoint';
import FBRequest from '../FBApi/FBApi.request';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBBuildTypeChangeApprovalConstructor } from '../FBBuildTypeChangeApproval/FBBuildTypeChangeApproval.types';

export class FBBuildTypeState {
  public transitionApi =
  new FBRequest<FBInlineApprovalBody, FBInlineApprovalTransitionBody | null>(FBEndpoint.ApprovalsTransition);

  @observable approvals?: FBInlineApprovalBody[];
  private readonly isOwner?: boolean;

  public constructor ({ approvals, isOwner }: FBBuildTypeChangeApprovalConstructor) {
    this.approvals = filter(approvals, (a) => a.status !== 'ABANDONED');
    this.isOwner = isOwner;
  }

  // MARK: @computed
  @computed public get getApprovals (): FBInlineApprovalBody[] {
    const filtered = filter(this.approvals, (a) => a.status !== 'ABANDONED' && a.type === 'SECTION' && a.fieldId === 'buildTypeApprovals');
    return map(filtered, (a: FBInlineApprovalBody) => ({
      ...a,
      canRequest: this.isOwner && a.status === 'DRAFT',
    }));
  }

  public static getBuildOptions (callback: (options: LHRBuild[]) => void) {
    const dispose = reaction(
      (): LHRBuild[] => {
        const map = FBAutocompleteAsyncStore.data.get(
          FBAutocompleteAsyncOption.buildType,
        );
        return map ? Array.from(map.values()) : [];
      },
      (options) => {
        callback(options);
      },
      { fireImmediately: true },
    );
    return dispose;
  }

  @action public setApprovals = (approvals?: FBInlineApprovalBody[]) => set(this, 'approvals', approvals);

  public applyTransition = (
    transition: FBInlineApprovalTransition,
    id?: string,
    body?: FBInlineApprovalTransitionBody,
    callback?: () => void,
  ) => {
    if (!id) { return; }
    this.transitionApi.set({
      url: FBEndpoint.ApprovalsTransition,
      urlValues: { id, transition },
      body,
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
}

export default FBBuildTypeState;
