import { POApprovalMatrixLevel, Signature } from '../FBPOApprovalMatrix.types';
import { FBPOAMKendoTableProps, SignatureWithStages } from './types';

export const buildSignatureStages = (
  level: POApprovalMatrixLevel,
  employees: FBPOAMKendoTableProps['employees'] = new Map(),
  groups: FBPOAMKendoTableProps['groups'] = new Map(),
): Record<number, SignatureWithStages> => level.signatures.reduce((list, signature) => ({
  ...list,
  [signature.signatureStage]: buildSignature(signature, groups, employees),
}), {});

export const buildSignature = (
  signature: Signature,
  groups: FBPOAMKendoTableProps['groups'] = new Map(),
  employees: FBPOAMKendoTableProps['employees'] = new Map(),
): SignatureWithStages => {
  const groupsList = signature.groups.map(({ id }) => ({
    id,
    name: groups.get(id)?.name ?? '',
  }));
  const employeesList = signature.employees.map(({ id }) => ({
    id,
    name: employees.get(id)?.user?.name ?? '',
  }));

  return {
    ...signature,
    groups: groupsList ?? [],
    employees: employeesList ?? [],
    list: [...groupsList, ...employeesList].map((el) => el.name).join(' '),
  };
};
