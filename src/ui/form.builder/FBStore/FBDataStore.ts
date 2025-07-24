import { findIndex, isArray, map, union, unionBy } from 'lodash';
import { action, computed, observable, set } from 'mobx';
import { Approval } from '../../../state/ducks/common/types';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { EditableMDItem } from '../../change.request/FBMaterialDisposition/components/FBMaterialDispositionTable/types';
import { EditableTLItem } from '../../change.request/FBMaterialDisposition/components/FBTasksListTable/types';
import { FBDataStoreApprovalKeys } from '../../documentRevision/forms/types';
import { FBInlineApprovalBody } from '../FBInlineApproval/FBInlineApproval.types';

class FBDataStore {
  @observable public refreshData: DocumentRevision | undefined;
  @observable public poApprovals: FBInlineApprovalBody[] | Approval[] = [];
  @observable public inlineApprovals: FBInlineApprovalBody[] | Approval[] = [];
  @observable public isDraftPartsAdded = false;
  @observable public selectedSliderInfo;
  @observable public newlyCreatedDocInfo;
  public documentTypes;
  public mdTableData: EditableMDItem[] = [];
  public tlTableData: EditableTLItem[] = [];
  public tlUpdatedDataIds: string[] = [];
  public mdUpdatedDataIds: string[] = [];

  @computed public get revisionChangeType () {
    return this.refreshData?.revisionChangeType;
  }

  @action public setIsDraftPartsAdded = (value) => {
    set(this, 'isDraftPartsAdded', value);
  };

  @action public setRefreshData = (value) => {
    set(this, 'refreshData', value);
  };

  @action public clearPoApprovals = () => {
    set(this, FBDataStoreApprovalKeys.PO_APPROVALS, []);
  };

  @action public clearInlineApprovals = () => {
    set(this, FBDataStoreApprovalKeys.INLINE_APPROVALS, []);
  };

  public setMDTableData = (mdTableData: EditableMDItem[]) => {
    set(this, 'mdTableData', mdTableData);
  };

  public setTLTableData = (tlTableData: EditableTLItem[]) => {
    set(this, 'tlTableData', tlTableData);
  };

  public addTLUpdatedDataId = (tlUpdatedDataId: string) => {
    set(this, 'tlUpdatedDataIds', union(this.tlUpdatedDataIds, [tlUpdatedDataId]));
  };

  public addMDUpdatedDataId = (mdUpdatedDataId: string) => {
    set(this, 'mdUpdatedDataIds', union(this.mdUpdatedDataIds, [mdUpdatedDataId]));
  };

  public get getMDTableData (): EditableMDItem[] {
    return this.mdTableData;
  }

  public get getTLTableData (): EditableTLItem[] {
    return this.tlTableData;
  }

  public get getTLUpdatedDataIds (): string[] {
    return this.tlUpdatedDataIds;
  }

  public get getMDUpdatedDataIds (): string[] {
    return this.mdUpdatedDataIds;
  }

  // key would be either "poApprovals", "inlineApprovals"
  @action public setApprovals = (approvals, key) => {
    let result: FBInlineApprovalBody[] | Approval[] = [];
    if (isArray(approvals)) {
      if (key === FBDataStoreApprovalKeys.INLINE_APPROVALS) {
        result = unionBy([...approvals], [...this[key]], 'id');
      } else if (key === FBDataStoreApprovalKeys.PO_APPROVALS) {
        result = [...this[key], ...approvals];
      }
    } else {
      const approvalData = [...this[key]];
      let previousIndex = -1;
      if (key === FBDataStoreApprovalKeys.PO_APPROVALS) {
        previousIndex = findIndex(approvalData, (approval) => approval?.approverId === approvals.approverId);
      } else if (key === FBDataStoreApprovalKeys.INLINE_APPROVALS) {
        // There can be multiple inline approvals, & so the logic on approverId fails
        previousIndex = findIndex(approvalData, (approval) => approval?.id === approvals.id);
      }

      if (previousIndex < 0) {
        result = [...this[key], ...[approvals]];
      } else {
        result = map(approvalData, (el, index: number) => index === previousIndex ? approvals : el);
      }
    }
    set(this, key, result);
  };
}

export default new FBDataStore();
