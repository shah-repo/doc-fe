import { isEmpty, map, sortBy, union } from 'lodash';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { action, observable, set } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import { FBApprovalMatrixConstructor, FBApprovalMatrixFieldData, FBApprovalMatrixFieldModes, FBApprovalMatrixItem, FBApprovalRole, FBDAMFields } from '..';
import { FBEndpoint } from '../defaults/FBEndpoint';
import FBRequest from '../FBApi/FBApi.request';

type DataKey = 'roles' | 'matrix';

type DataType<T extends DataKey> =
    T extends 'roles' ? FBApprovalRole :
      T extends 'matrix' ? FBApprovalMatrixItem :
        never;

class FBApprovalMatrixFieldState extends FBRequest<FBApprovalMatrixFieldData, null> {
  @observable public mode: FBApprovalMatrixFieldModes = FBApprovalMatrixFieldModes.NONE;
  public url = FBEndpoint.ApprovalMatrix;

  public constructor ({ formValue, outputRevision, isOutput }: FBApprovalMatrixConstructor) {
    super();

    if (!isOutput) {
      return;
    }

    const isFormEmpty = isEmpty(formValue)
      || !(formValue && Boolean(
        Object.values(formValue).find((dataKeys) => !isEmpty(dataKeys)),
      ))
      || !formValue?.[FBDAMFields.DAM]
      || !formValue?.[FBDAMFields.DAR];

    if (isFormEmpty || outputRevision) {
      this.set({
        url: this.url,
        method: 'get',
      }, (data) => {
        this.setData({
          approvalMatrix: (formValue?.[FBDAMFields.DAM] ?? data?.approvalMatrix ?? []) as FBApprovalMatrixItem[],
          approvalRoles: (formValue?.[FBDAMFields.DAR] ?? data?.approvalRoles ?? []) as FBApprovalRole[],
        });
      });
      return;
    }

    this.data = formValue;
  }

  public extractData = <T extends DataKey>(data: FBApprovalMatrixFieldData | undefined, type: T): Array<DataType<T>> | undefined => {
    if (!data) {
      return undefined;
    }

    switch (type) {
      case 'roles':
        return (
          data.approvalRoles
          ?? data[FBDAMFields.DAR]?.approvalRoles
          ?? data[FBDAMFields.DAR]
        ) as Array<DataType<T>>;
      case 'matrix':
        return (
          data.approvalMatrix
          ?? data[FBDAMFields.DAM]?.approvalMatrix
          ?? data[FBDAMFields.DAM]
        ) as Array<DataType<T>>;
      default:
        return undefined;
    }
  };

  public getCurrentData = <T extends DataKey>(type: T): Array<DataType<T>> | undefined => {
    return this.extractData(this.data, type);
  };

  @action public prepareData = (data: FBApprovalMatrixFieldData): FBApprovalMatrixFieldData | undefined => (this.data = {
    approvalRoles: data?.approvalRoles.map((x) => ({
      ...x,
      groups: x.groups.map((y) => ({ id: y.id })),
      employees: x.employees.map((y) => ({ id: y.id })),
    })) || [],
    approvalMatrix: sortBy(data?.approvalMatrix, (row) => row.docType.name.toLowerCase()) || [],
  });

  @action public setMode = (mode: FBApprovalMatrixFieldModes): void => {
    set(this, 'mode', mode);
  };

  @action public setData = (data: FBApprovalMatrixFieldData | undefined): void => {
    set(this, 'data', {
      approvalRoles: this.extractData(data, 'roles') ?? this.getCurrentData('roles') ?? [],
      approvalMatrix: this.extractData(data, 'matrix') ?? this.getCurrentData('matrix') ?? [],
    });
  };

  @action public setApprovalRoles = (approvalRoles?: FBApprovalRole[]): void => {
    set(this, 'data', {
      approvalRoles,
      approvalMatrix: this.getCurrentData('matrix') ?? [],
    });
  };

  @action public setApprovalMatrix = (approvalMatrix?: FBApprovalMatrixItem[]): void => {
    set(this, 'data', {
      approvalRoles: this.getCurrentData('roles') ?? [],
      approvalMatrix,
    });
  };

  @action public addApprovalRole = (role: FBApprovalRole): void => {
    const defaultApprovalRoles: FBApprovalRole[] = this.getCurrentData('roles') ?? [];
    const defaultApprovalMatrix: FBApprovalMatrixItem[] = this.getCurrentData('matrix') ?? [];
    const approvalRoles = union(defaultApprovalRoles, [{
      ...role,
      id: uuidv4(),
      index: defaultApprovalRoles?.length || 0,
    }]);
    const approvalMatrix = map(defaultApprovalMatrix, (am) => {
      map(new Array(approvalRoles.length), (_, i) => {
        am.approvalRoles.stage1[i] = am.approvalRoles.stage1[i] || false;
        am.approvalRoles.stage2[i] = am.approvalRoles.stage2[i] || false;
        am.approvalRoles.stage3[i] = am.approvalRoles.stage3[i] || false;
        am.approvalRoles.admStage[i] = am.approvalRoles.admStage[i] || false;
      });
      return am;
    });
    set(this, 'data', { approvalRoles, approvalMatrix });
  };
}

export default FBApprovalMatrixFieldState;
