import { useObserver } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FB } from "../..";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import { GetEmployeeResponse, userManagementActions, userManagementSelectors } from "../../../../state/ducks/userManagement";
import { DEFAULT_ACTIVE_EMPLOYEES } from "../../../group.management/utils/types";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { FBPOApprovalMatrixTableProps } from "../FBPOApprovalMatrix.types";
import FBPOApprovalMatrixForm from "../form/FBPOApprovalMatrixForm";
import FBPOApprovalMatrixFormActions from "../form/FBPOApprovalMatrixForm.actions";

export const withFBPOApprovalMatrixTable = <T extends FBPOApprovalMatrixTableProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    approvalLevels,
    name,
    ...props
  }: T) => {
    const { workspaceState, dialogState, formState } = FB.useStores();
    const { document } = workspaceState || {};

    const isDocumentReleased = document?.status === DocumentRevisionStatus.Released;
    const groupOptions = useSelector(userManagementSelectors.getOfficialGroups);
    const [employees, setActiveEmployees] = useState<GetEmployeeResponse[]>(
      DEFAULT_ACTIVE_EMPLOYEES,
    );
    const getEmployeeAction = useActionCreator(userManagementActions.getEmployee);
    const asyncGetActiveEmployees = useAsync<GetEmployeeResponse[]>({
      onSuccess: (data: GetEmployeeResponse[] = []) => {
        setActiveEmployees(data);
      },
    });

    useEffect(() => {
      if (props.disabled && !isDocumentReleased) {
        return;
      }
      asyncGetActiveEmployees.start(getEmployeeAction, { active: true }, asyncGetActiveEmployees);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.disabled, isDocumentReleased]);

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


    const handleEdit = (index, item) => () => {
      if (props.disabled && !isDocumentReleased) {
        return;
      }
      poamState?.setFormValues(item, groupOptions, employees);
      setIndex(index);
      dialogState?.config({
        open: true,
        title: "form.builder.add.item",
        content: <FBPOApprovalMatrixForm initialValues={item} signatureStages={[1, 2, 3]} />,
        actions: <FBPOApprovalMatrixFormActions />,
      });

      // setInitialValues({
      //   [props.name + "-formValues"]: { ...formState?.getFieldValue(props.name + "-formValues"), id: item.id },
      // });
      // dialog.open();
    };

    const onSubmit = (item) => {
      poamState?.editItem(index || 0, item);
      setIndex(undefined);
      setInitialValues(undefined);
      poamState?.clearFormValues();
    };

    useObserver(() => {
      approvalLevels = poamState?.approvalLevels;
      formState?.setFieldValue(name + ".approvalLevels", approvalLevels);
    });

    return Component({
      ...(props as T),
      initialValues,
      approvalLevels,
      onSubmit,
      groupOptions,
      isDialogOpen: dialog.isOpen,
      closeDialog,
      employees,
      handleEdit,
      signatureStages,
      isDocumentReleased,
    });
  };

  return (props: T) => Comp(props);
};
