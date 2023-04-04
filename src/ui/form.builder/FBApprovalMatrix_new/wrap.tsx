import React from "react";
import { useObserver } from "mobx-react";
import { isEmpty, get, has } from "lodash";
import { FB, FBApprovalMatrixFieldData, FBApprovalMatrixItem, FBDAMFields } from "..";
import { FBApprovalMatrixProps } from "./types";

export const withFBApprovalMatrix = <T extends FBApprovalMatrixProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleSave,
    handleCancel,
    disabled,
    name = "",
    mode = "none",
    isInputOwner,
    data,
    ...props
  }: T) => {
    const { formState, approvalMatrixFieldState, workspaceState } = FB.useStores();

    isInputOwner = workspaceState?.getIsInputOwner(name);
    disabled = !isInputOwner || disabled;

    handleSave = () => {
      const formValue = formState?.getFieldValue(name);
      const approvalMatrixValues: FBApprovalMatrixItem[] = formValue?.approvalMatrix ?? formValue ?? [];

      const approvalMatrix = approvalMatrixValues.map((e) => {
        const categoryTrim = e?.docType.category?.trim();
        return {
          ...e,
          docType: {
            ...e?.docType,
            acronym: e?.docType.acronym?.toUpperCase(),
            category: categoryTrim ?? "",
          },
        };
      });

      if (isEmpty(approvalMatrix)) { return; }

      approvalMatrixFieldState?.setApprovalMatrix(approvalMatrix);
      approvalMatrixFieldState?.setMode("none");
    };

    handleCancel = () => {
      const formValue: Partial<FBApprovalMatrixFieldData> = formState?.getFieldValue(name);
      if (formValue?.approvalMatrix) {
        formState?.setFieldValue(name, {
          ...formValue,
          approvalMatrix: formValue?.approvalMatrix.slice(0, -1),
        });
      }
      approvalMatrixFieldState?.setMode("none");
    };

    const { formInput } = workspaceState || {};
    const approvalRoles = get(formInput, FBDAMFields.DAR, []);
    const formInputDAM = get(formInput, FBDAMFields.DAM, []);
    const isDAMInNewFormat = has(formInputDAM, "approvalMatrix");
    const approvalMatrix = isDAMInNewFormat ? formInputDAM.approvalMatrix : formInputDAM;

    data = useObserver(() => ({
      ...approvalMatrixFieldState?.data as FBApprovalMatrixFieldData,
      approvalMatrix,
      approvalRoles,
    }));

    return Component({
      ...(props as T),
      handleSave,
      handleCancel,
      disabled,
      name,
      mode,
      data,
    });
  };

  return (props: T) => Comp(props);
};
