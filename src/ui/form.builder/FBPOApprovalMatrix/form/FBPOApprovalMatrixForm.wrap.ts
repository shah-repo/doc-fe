import React from "react";
import { FB } from "../..";
import { FBPOApprovalMatrixFormActionsProps, POApprovalMatrixLevel } from "../FBPOApprovalMatrix.types";

export const withFBPOApprovalMatrixForm = <T extends FBPOApprovalMatrixFormActionsProps>(
  Component: React.FunctionComponent<T>
) => {

  const Comp = ({
    handleAdd,
    handleCancel,
    ...props
  }: T) => {

    const { dialogState, formState, poamState } = FB.useStores();

    handleAdd = () => {
      const formValues = formState?.getValues();
      poamState?.addItem(formValues as POApprovalMatrixLevel);
      dialogState?.closeDialog();
    };
    handleCancel = () => dialogState?.closeDialog();

    return Component({
      ...(props as T),
      handleAdd,
      handleCancel,
    });
  };

  return (props: T) => Comp(props);
};

// export const withFBPOApprovalMatrixForm = <T extends FBPOApprovalMatrixFormProps>(
//   Component: React.FunctionComponent<T>
// ) => {

//   const Comp = ({
//     name = "",
//     onSubmit,
//     initialValues = {} as Dictionary<any>,
//     ...props
//   }: T) => {
//     const { workspaceState, poamState } = FB.useStores();
//     const { document } = workspaceState || {};


//     const handleSubmit = (values) => {
//       const item = values[`${name}-formValues`];
//       onSubmit({
//         name: item.name,
//         limit: parseInt(item.limit, 10),
//         id: item.id || generateUuid(),
//         signatures: signatureStages?.map((stage) => ({
//           signatureStage: stage,
//           id: initialValues[`${name}-formValues`]?.[stage - 1].id || generateUuid(),
//           groups: item[`signature${stage}groups`]?.map((group) => ({ id: group.value })) || [],
//           employees: item[`signature${stage}employees`]?.map((employee) => ({ id: employee.value })) || [],
//         })),
//       });
//       props.closeDialog();
//     };

//     const validateForm = (values) => {
//       const item = values[`${name}-formValues`];
//       const required = "form.builder.required";
//       const errors: any = {
//         name: required,
//         limit: required,
//       };

//       if (!item) {
//         return errors;
//       }

//       Object.keys(errors).forEach((key) => {
//         item[key] && delete errors[key];
//       });
//       return errors;
//     };

//     const groupOptions = useSelector(userManagementSelectors.getOfficialGroups);
//     const isDocumentReleased = document?.status === DocumentRevisionStatus.Released;
//     const [activeEmployees, setActiveEmployees] = useState<GetEmployeeResponse[]>(
//       DEFAULT_ACTIVE_EMPLOYEES,
//     );
//     const getEmployeeAction = useActionCreator(userManagementActions.getEmployee);
//     const asyncGetActiveEmployees = useAsync<GetEmployeeResponse[]>({
//       onSuccess: (data: GetEmployeeResponse[] = []) => {
//         setActiveEmployees(data);
//       },
//     });

//     useEffect(() => {
//       if (props.disabled && !isDocumentReleased) {
//         return;
//       }
//       asyncGetActiveEmployees.start(getEmployeeAction, { active: true }, asyncGetActiveEmployees);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [props.disabled, isDocumentReleased]);

//     const signatureStages = [1, 2, 3];

//     return Component({
//       ...(props as T),
//       poamState,
//       name,
//       onSubmit: handleSubmit,
//       validateForm,
//       initialValues,
//       employees: activeEmployees,
//       groupOptions,
//       signatureStages,
//     });
//   };

//   return (props: T) => Comp(props);
// };
