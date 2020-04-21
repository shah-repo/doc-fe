import React, { useState } from "react";
import { FB } from "../..";
import FBStore from "../../stores/ui/FBStore";
import { FBApprovalMatrixTableProps } from "../FBApprovalMatrix.types";

export const withFBApprovalMatrixTable = <T extends FBApprovalMatrixTableProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    ...props
  }: T) => {
    const { amState } = FB.useStores();

    const [addMode, setAddMode] = useState(false);

    // const { document } = FBStore;
    // const isDocumentReleased = document.status === DocumentRevisionStatus.Released;

    const handleEditDefaultTraining = (index, item) => () => {
      amState?.editDefaultTraining(index, item);
      FBStore.resetSchema();
    };

    const handleEdit = (index, item, stage, indexItem) => () => {
      amState?.editApprovalMatrixRole(index, item, stage, indexItem);
      FBStore.resetSchema();
    };

    const handleAdd = () => {
      setAddMode(true);
      const approvalRolesByIndex = amState?.am.approvalRoles.map(() => false);
      const newEmptyItem = {
        docType: {
          name: "",
          acronym: "",
          defaultTraining: false,
          group: "",
        },
        approvalRoles: {
          stage1: approvalRolesByIndex as boolean[],
          stage2: approvalRolesByIndex as boolean[],
          stage3: approvalRolesByIndex as boolean[],
          admStage: approvalRolesByIndex as boolean[],
        },
      };
      amState?.addApprovalMatrixItem(newEmptyItem);
    };


    const cancelAddMode = () => {
      setAddMode(false);
      amState?.removeAddedItem();
    };

    const handleAddRoleItems = (index, item, type) => {
      amState?.editApprovalRoleItem(index, item, type);
    };
    // const saveNewRowData = () => {
    //   setAddMode(false);
    //   console.log("New row is saved");
    // };

    return Component({
      ...(props),
      approvalMatrix: amState?.am.approvalMatrix,
      approvalRoles: amState?.am.approvalRoles,
      handleEditDefaultTraining,
      handleEdit,
      handleAdd,
      cancelAddMode,
      handleAddRoleItems,
      addMode,
    });
  };

  return (props: T) => Comp(props);
};
