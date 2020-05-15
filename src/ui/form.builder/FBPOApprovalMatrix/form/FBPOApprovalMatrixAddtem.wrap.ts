import React from "react";
import { FB } from "../..";
import useDialog from "../../../hooks/useDialog";
import { FBPOApprovalMatrixAddItemProps } from "../FBPOApprovalMatrix.types";

export const withFBPOApprovalMatrixAddItem = <T extends FBPOApprovalMatrixAddItemProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    ...props
  }: T) => {
    const { poamState } = FB.useStores();
    const dialog = useDialog();
    const openDialog = () => {
      if (props.disabled) {
        return;
      }

      dialog.open();
    };

    const closeDialog = () => {
      dialog.close();
      poamState?.resetFormValues();
    };

    const onSubmit = (item) => {
      dialog.close();
      poamState?.addItem({
        ...item,
        limit: parseInt(item.limit, 10),
        id: item.id,
        signatures: item.signatures.map((it) => ({
          id: it.id,
          signatureStage: it.signatureStage,
          groups: it.groups,
          employees: it.employees,
        })),
      });
      poamState?.clearFormValues();
    };

    const signatureStages = [1, 2, 3];


    return Component({
      ...(props),
      poamState,
      openDialog,
      closeDialog,
      isDialogOpen: dialog.isOpen,
      onSubmit,
      approvalLevels: poamState?.poam.approvalLevels,
      employees: props.employees,
      groupOptions: props.groupOptions,
      signatureStages,
    });
  };

  return (props: T) => Comp(props);
};
