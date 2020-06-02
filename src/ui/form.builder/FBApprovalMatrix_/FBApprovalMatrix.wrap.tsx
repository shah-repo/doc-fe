import { useObserver } from "mobx-react";
import React from "react";
import { FBApprovalMatrixProps } from ".";
import { FB, FBApprovalMatrixFieldData, FBApprovalMatrixSection, FBApprovalMatrixTable, FBDialogState } from "..";

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
    name,
    mode = "none",
    ...props
  }: T) => {

    const { formState, approvalMatrixFieldState } = FB.useStores();
    dialogState = FB.useRef<FBDialogState>(FBDialogState);


    const modeContent = () => (
      <>
        <FBApprovalMatrixSection
          {...{ handleEdit, handleFullScreen, disabled, mode }}
        />
        <FBApprovalMatrixTable {...{ name, mode }} />
      </>
    );

    handleSave = () => {
      const formValue: Partial<FBApprovalMatrixFieldData> = formState?.getFieldValue(name);
      approvalMatrixFieldState?.setApprovalMatrix(formValue.approvalMatrix);
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
    });
  };

  return (props: T) => Comp(props);
};
