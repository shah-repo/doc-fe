import React from "react";
import { isEmpty } from "lodash";
import { FB, FBApprovalMatrixFieldData, FBApprovalMatrixItem } from "..";
import { FBApprovalMatrixProps } from "./FBApprovalMatrix.types";

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

    return Component({
      ...(props as T),
      handleSave,
      handleCancel,
      disabled,
      name,
      mode,
    });
  };

  return (props: T) => Comp(props);
};
