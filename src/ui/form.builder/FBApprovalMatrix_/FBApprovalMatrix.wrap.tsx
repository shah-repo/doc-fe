import { isEmpty } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBApprovalMatrixFieldData, FBApprovalMatrixItem, FBApprovalMatrixProps, FBApprovalMatrixSection, FBApprovalMatrixTable, FBDialogState, FBWorkspaceMode } from "..";
import { SM } from "../../../App";

export const withFBApprovalMatrix = <T extends FBApprovalMatrixProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleSave,
    handleCancel,
    handleEdit,
    handleFullScreen,
    dialogState,
    disabled,
    name = "",
    mode = "none",
    isInputOwner,
    ...props
  }: T) => {

    const { formState, approvalMatrixFieldState, workspaceState } = FB.useStores();
    const { _documentRevisionFormState } = SM.useStores();
    dialogState = FB.useRef<FBDialogState>(FBDialogState);
    isInputOwner = workspaceState?.getIsInputOwner(name);
    disabled = !isInputOwner || disabled;

    const modeContent = () => (
      <>
        <FBApprovalMatrixSection
          {...{ handleEdit, handleFullScreen, disabled, mode, dialogState }}
          workspaceMode={workspaceState?.mode as FBWorkspaceMode}
        />
        <FBApprovalMatrixTable {...{ name, mode }} />
      </>
    );

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

    handleEdit = () => {
      if (mode !== "edit") {
        approvalMatrixFieldState?.setMode("edit");
      } else {
        handleSave && handleSave();
      }
    };

    handleFullScreen = () => {
      handleSave && handleSave();
      if (dialogState?.open) {
        approvalMatrixFieldState?.setMode("none");
        return;
      }
      dialogState?.config({
        open: true,
        maxWidth: "xl",
        content: modeContent(),
      });
    };

    useObserver(() => {
      approvalMatrixFieldState && (mode = approvalMatrixFieldState.mode);
      // Used for disabling save while DAM is in add mode
      // to prevent saving an empty row in the table
      if (approvalMatrixFieldState?.mode === "add") {
        _documentRevisionFormState?.setDisabledAction(true);
      }
      else {
        _documentRevisionFormState?.setDisabledAction(false);
      }

      if (dialogState?.open) {
        dialogState.setContent(modeContent());
      }
    });

    return Component({
      ...(props as T),
      handleSave,
      handleCancel,
      handleEdit,
      handleFullScreen,
      dialogState,
      disabled,
      name,
      mode,
      workspaceMode: workspaceState?.mode,
    });
  };

  return (props: T) => Comp(props);
};
