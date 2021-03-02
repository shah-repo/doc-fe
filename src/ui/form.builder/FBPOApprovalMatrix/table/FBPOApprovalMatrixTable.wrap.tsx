import { find, map, sortBy } from "lodash";
import { useObserver } from "mobx-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FB, FBAutocompleteAsyncOption } from "../..";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions/types";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import useDialog from "../../../hooks/useDialog";
import FBAutocompleteAsyncStore from "../../FBAutocompleteAsync/FBAutocompleteAsync.store";
import { FBPOApprovalMatrixTableProps, POApprovalMatrixLevel, Signature } from "../FBPOApprovalMatrix.types";
import FBPOApprovalMatrixForm from "../form/FBPOApprovalMatrixForm";
import FBPOApprovalMatrixFormActions from "../form/FBPOApprovalMatrixForm.actions";

export const withFBPOApprovalMatrixTable = <T extends FBPOApprovalMatrixTableProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    approvalLevels,
    name,
    groups,
    employees,
    ...props
  }: T) => {
    const { workspaceState, dialogState, formState } = FB.useStores();
    const { document } = workspaceState || {};

    const isDocumentReleased = document?.status === DocumentRevisionStatus.Released;
    const groupOptions = useSelector(userManagementSelectors.getOfficialGroups);

    const { poamState } = FB.useStores();

    const [initialValues, setInitialValues] = useState<any>(undefined);
    const [index, setIndex] = useState(undefined);
    const dialog = useDialog();

    const closeDialog = () => {
      dialog.close();
      setIndex(undefined);
      setInitialValues(undefined);
      poamState?.resetFormValues();
    };

    const signatureStages = [1, 2, 3];


    const handleEdit = (index, item: POApprovalMatrixLevel) => () => {
      if (props.disabled && !isDocumentReleased) {
        return;
      }
      setIndex(index);
      const stages = map(signatureStages, (signatureStage) =>
        find(item.signatures, { signatureStage }) || { signatureStage });
      item = {
        ...item,
        signatures: sortBy(stages, "signatureStage") as Signature[],
      };
      dialogState?.config({
        open: true,
        title: "form.builder.add.item",
        content: <FBPOApprovalMatrixForm initialValues={item} signatureStages={[1, 2, 3]} />,
        actions: <FBPOApprovalMatrixFormActions />,
      });
    };

    const onSubmit = (item) => {
      poamState?.editItem(index || 0, item);
      setIndex(undefined);
      setInitialValues(undefined);
      poamState?.clearFormValues();
    };

    useObserver(() => {
      approvalLevels = sortBy(poamState?.approvalLevels, ["limit"]);
      formState?.setFieldValue(name + ".approvalLevels", approvalLevels);
      groups = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.officialGroups);
      employees = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.employees);
    });

    return Component({
      ...(props as T),
      initialValues,
      approvalLevels,
      onSubmit,
      groups,
      employees,
      groupOptions,
      isDialogOpen: dialog.isOpen,
      closeDialog,
      handleEdit,
      signatureStages,
      isDocumentReleased,
    });
  };

  return (props: T) => Comp(props);
};
