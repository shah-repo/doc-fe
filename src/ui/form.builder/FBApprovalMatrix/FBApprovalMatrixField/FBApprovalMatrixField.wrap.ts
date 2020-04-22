import React, { useEffect, useState } from "react";
import * as generateUuid from "uuid/v4";
import { FB } from "../..";
import { documentTypeActions } from "../../../../state/ducks/documentRevisions/documentType";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions/types";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import FBStore from "../../stores/ui/FBStore";
import { ApprovalMatrix, FBApprovalMatrixTableProps } from "../FBApprovalMatrix.types";

export const withFBApprovalMatrixTable = <T extends FBApprovalMatrixTableProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    ...props
  }: T) => {
    const { amState } = FB.useStores();
    const { document } = FBStore;
    const isDocumentReleased = document.status === DocumentRevisionStatus.Released;

    const [addMode, setAddMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const async = useAsync({
      onSuccess: (response) => {
        amState?.setApprovalMatrix(response as ApprovalMatrix);
      },
    });
    const loadAction = useActionCreator(documentTypeActions.getApprovalMatrix);

    useEffect(() => {
      if (props.disabled && !isDocumentReleased) {
        return;
      }
      async.start(loadAction, async);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.disabled, isDocumentReleased]);

    const disabled = props.disabled;
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
        id: generateUuid(),
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
      setErrorMessage("");
      amState?.removeAddedItem();
    };

    const handleAddRoleItems = (index, item, type) => {
      let stringItems = item;
      if (type === "acronym") {
        stringItems = item.toUpperCase();
      }
      amState?.editApprovalRoleItem(index, stringItems, type);
    };

    const handleSaveChanges = () => {
      const docType = amState?.am.approvalMatrix[amState.am.approvalMatrix.length - 1].docType;
      if (docType?.acronym === "" || docType?.group === "" || docType?.name === "") {
        setErrorMessage("Input field must be filled out before submitting the new row");
        return;
      }
      setAddMode(false);
      setErrorMessage("");
      FBStore.resetSchema();
    };

    const handleEditRoleDetails = (e, index, type) => {
      if (type === "name") {
        amState?.editName(index, e.target.value, type);
        FBStore.resetSchema();
        return;
      }
      amState?.editApprovalRoles(index, e, type);
      FBStore.resetSchema();
    };

    const addAnotherRole = () => {
      const newEmptyItem = {
        id: generateUuid(),
        name: "",
        index: amState?.am.approvalRoles.length as number,
        employees: [],
        groups: [],
      };
      amState?.addApprovalRoleItem(newEmptyItem);
    };

    const handleSaveRole = (dialog) => {
      const approvalRoles = amState?.am.approvalRoles[amState.am.approvalRoles.length - 1];
      if (approvalRoles?.name === "") {
        setErrorMessage("Name is required");
        return;
      }
      dialog.close();
      setErrorMessage("");
    };

    const handleCancelDialogRole = () => {
      setErrorMessage("");
      amState?.removeAddedRole();
      FBStore.resetSchema();
    };

    return Component({
      ...(props),
      approvalMatrix: amState?.am.approvalMatrix,
      approvalRoles: amState?.am.approvalRoles,
      handleEditDefaultTraining,
      handleEdit,
      handleAdd,
      cancelAddMode,
      handleAddRoleItems,
      handleSaveChanges,
      errorMessage,
      addMode,
      handleEditRoleDetails,
      addAnotherRole,
      handleSaveRole,
      handleCancelDialogRole,
      disabled,
    });
  };

  return (props: T) => Comp(props);
};
