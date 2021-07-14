import { isEmpty } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FB, FBPOReceiveFormProps } from "..";
import { Id } from "../../../state/ducks/common/types";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { getReceivedQuantity } from "../FBPOReceive/utils";
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
    const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
    const { dialogState, formState, poReceiveState, workspaceState } = FB.useStores();
    const documentId = workspaceState?.documentId as string;
    const name = workspaceState?.schema?.find((e) => e.type === "poreceive")?.name as string;
    const receivedItems = workspaceState?.getFieldByName(name).receivedItems ?? [];

    const id = item?.partNumber || item?.id;

    const rcItemQuantity = getReceivedQuantity(receivedItems, id);

    const rcItem = {
      ...item,
      received: rcItemQuantity,
    };

    const poReceiveFormState = FB.useRef<FBPOReceiveFormState>(
      FBPOReceiveFormState,
      { groupOptions, item: rcItem, documentId }
    );

    handleReceive = async () => {
      if (!workspaceState?.documentId) {
        return;
      }
      const values = formState?.getValues();
      const receivedItems = workspaceState.document?.formInput?.[name]?.receivedItems ?? [];
      const id = poReceiveFormState.item?.partNumber ?? poReceiveFormState.item?.id;
      const hasReceivedItem = (receivedItems, id) => !isEmpty(receivedItems.find((e) => e.itemId === id));

      const calculatedReceivedItems = (id) => receivedItems.map((e) => {
        if (e.itemId === id) {
          return {
            ...e,
            received: values?.received ?? 0,
          };
        }
        return e;
      });

      const newReceivedItems = hasReceivedItem(receivedItems, id) ? calculatedReceivedItems(id) : [...receivedItems, ({
        itemId: id,
        received: values?.received,
      })];

      const handleReceivedItems = isEmpty(receivedItems) ? [{
        itemId: id,
        received: values?.received,
      }] : newReceivedItems;

      const receivedItemsInput = {
        ...workspaceState.document?.formInput,
        [name]: {
          ...workspaceState.document?.formInput?.[name],
          receivedItems: handleReceivedItems,
        },
      };
      const hasNoReference = isEmpty(workspaceState.document?.referenceTo.find(
        (e) => e.id === poReceiveState?.data?.document.id));
      poReceiveFormState.addReceiveQuantity(
        workspaceState.id,
        {
          formInput: receivedItemsInput,
          referenceTo: hasNoReference ?
            [{
              ...workspaceState.document?.referenceTo,
              id: poReceiveState?.data?.document.id,
            }] as Id[] : undefined,
        });

      dialogState?.closeDialog();
      await poReceiveState?.setPOId(poReceiveState?.data?.id);
      dispatch(documentRevisionsActions.reload(workspaceState?.document?.id as string));
    };


    return Component({
      item: rcItem,
      ...(props as T),
      handleCancel: dialogState?.closeDialog,
      handleReceive,
    });
  };

  return (props: T) => Comp(props);
};
