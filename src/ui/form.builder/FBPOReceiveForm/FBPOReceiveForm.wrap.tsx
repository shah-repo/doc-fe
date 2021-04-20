import { isString } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { FB, FBPOReceiveFormProps } from "..";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { toastError } from "../../components/notifications";
import useGetDocTypeByAcronym from "../../hooks/useGetDocTypeByAcronym";
import FBPOReceiveFormState from "./FBPOReceiveForm.state";

export const withFBPOReceiveForm = <T extends FBPOReceiveFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleCancel,
    handleReceive,
    item,
    ...props
  }: T) => {

    const dispatch = useDispatch();
    const intl = useIntl();
    // TODO: find better solution, acronyms will be different per company
    const lfpoDocType = useGetDocTypeByAcronym("LFPO-");
    const lotDocType = useGetDocTypeByAcronym("LOT-");
    const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
    const { dialogState, formState, poReceiveState, workspaceState } = FB.useStores();
    const documentId = workspaceState?.documentId;

    const poReceiveFormState = FB.useRef<FBPOReceiveFormState>(
      FBPOReceiveFormState,
      { lfpoDocType, lotDocType, groupOptions, item, documentId }
    );


    handleReceive = async () => {
      if (!workspaceState?.documentId) {
        return;
      }
      if (!poReceiveFormState.item?.partNumber) {
        const values = formState?.getValues();
        const currentPOName = poReceiveState?.data?.formDocument?.formTemplate?.schema.find((e) =>
          e.type === "purchaseorder")?.name as string;
        const overridenItem = poReceiveState?.data?.formInput?.[currentPOName].items.map((e, index) => {
          if (index === poReceiveFormState.item?.index) {
            return {
              ...e,
              received: values?.received,
            };
          }
          return { ...e };
        });
        const overridenPO = {
          ...poReceiveState?.data?.formInput,
          [currentPOName]: {
            ...poReceiveState?.data?.formInput?.[currentPOName],
            items: [...overridenItem],
          },
        };
        poReceiveFormState.addReceiveQuantity(poReceiveState?.data?.id, { formInput: overridenPO });
        return;
      }
      try {
        await poReceiveFormState?.submit(
          formState?.getValues(),
          poReceiveState?.poDocumentId,
        );

        dispatch(documentRevisionsActions.reload(workspaceState.documentId));
        dialogState?.closeDialog();
      } catch (e) {
        if (isString(e.message)) {
          toastError(intl.formatMessage({ id: e.message }));
        }
      }
    };

    return Component({
      ...(props as T),
      handleCancel: dialogState?.closeDialog,
      handleReceive,
    });
  };

  return (props: T) => Comp(props);
};
