import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FB } from "../..";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import { GetEmployeeResponse, userManagementActions, userManagementSelectors } from "../../../../state/ducks/userManagement";
import { toMembersOptions } from "../../../group.management/utils/transform";
import { DEFAULT_ACTIVE_EMPLOYEES } from "../../../group.management/utils/types";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import FBStore from "../../stores/ui/FBStore";
import { FBPOApprovalMatrixTableProps } from "../FBPOApprovalMatrix.types";

export const withFBPOApprovalMatrixTable = <T extends FBPOApprovalMatrixTableProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    ...props
  }: T) => {
    const { document } = FBStore;
    const isDocumentReleased = document.status === DocumentRevisionStatus.Released;
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
      poamState?.clearFormValues();
    };

    const signatureStages = [1, 2, 3];


    const handleEdit = (index, item) => () => {
      if (props.disabled && !isDocumentReleased) {
        return;
      }
      poamState?.setFormValues(item, groupOptions, employees);
      setIndex(index);
      const signaturesByStage = signatureStages?.map((level) => ({
        [`${props.name}-formValues.signature${level}.groups`]: groupOptions.filter((option) => {
          const selectedGroupIds = item.signatures[level as unknown as number - 1]?.groups?.map((group) => group.id);
          if (selectedGroupIds?.includes(option.value)) {
            return option;
          }
          return null;
        }),
        [`${props.name}-formValues.signature${level}.employees`]: toMembersOptions(employees).filter((option) => {
          const selectedEmployeeIds = item.signatures[level as unknown as number - 1]?.employees?.map((employee) =>
            employee.id);
          if (selectedEmployeeIds?.includes(option.value)) {
            return option;
          }
          return null;
        }),
      }));

      const signatures = Object.assign({}, ...signaturesByStage?.map((signature) => signature) as any);

      setInitialValues({
        [`${props.name}-formValues.name`]: item.name,
        [`${props.name}-formValues.limit`]: item.limit,
        ...signatures,
      });
      dialog.open();
    };

    const onSubmit = (item) => {
      poamState?.editItem(index || 0, item);
      setIndex(undefined);
      setInitialValues(undefined);
      poamState?.clearFormValues();
    };

    return Component({
      ...(props),
      initialValues,
      approvalLevels: poamState?.poam.approvalLevels,
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
