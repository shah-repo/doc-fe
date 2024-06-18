import { first, isEmpty } from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FB, FBPOReceiveFormProps, IReceivedItem } from '..';
import { Id } from '../../../state/ducks/common/types';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { userManagementSelectors } from '../../../state/ducks/userManagement';
import { getExistingReceivedItem, receivedItemEqualityCheck } from '../FBPOReceive/utils';
import FBDataStore from '../FBStore/FBDataStore';
import FBPOReceiveFormState from './FBPOReceiveForm.state';

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
    const name = first(workspaceState?.getItemsByType('poreceive'))?.name || '';

    const poReceiveFormState = FB.useRef<FBPOReceiveFormState>(
      FBPOReceiveFormState,
      { groupOptions, item, documentId },
    );

    handleReceive = async () => {
      if (!workspaceState?.documentId) {
        return;
      }
      const values = formState?.getValues();
      const receivedItems: IReceivedItem[] = (workspaceState.document?.formInput?.[name]?.receivedItems ?? []) as IReceivedItem[];

      const id = poReceiveFormState.item?.partNumber ?? poReceiveFormState.item?.id;
      const rowId: string | undefined = poReceiveFormState.item?.id;

      const existingReceivedItem = getExistingReceivedItem(receivedItems, poReceiveFormState.item);

      const calculatedReceivedItems = () => receivedItems.map((receivedItem: IReceivedItem) => {
        if (receivedItemEqualityCheck(receivedItem, poReceiveFormState.item)) {
          return {
            ...receivedItem,
            rowId: poReceiveFormState.item?.id,
            received: values?.received ?? 0,
          };
        }
        return receivedItem;
      });

      const newReceivedItems = existingReceivedItem ? calculatedReceivedItems() : [...receivedItems, ({
        itemId: id,
        rowId,
        received: values?.received,
      })];

      const handleReceivedItems = isEmpty(receivedItems) ? [{
        itemId: id,
        rowId,
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
      const updatedRevision = await poReceiveState?.addReceiveQuantity(
        workspaceState.id,
        {
          formInput: receivedItemsInput,
          referenceTo: hasNoReference
            ? [{
              id: poReceiveState?.data?.document.id,
            }] as Id[] : undefined,
        });

      dialogState?.closeDialog();
      workspaceState.setFormInputData(updatedRevision);
      FBDataStore.setRefreshData(updatedRevision);
      await poReceiveState?.setPOId(poReceiveState?.data?.id);
      dispatch(documentRevisionsActions.documentRevisionSet(updatedRevision));
    };

    return Component({
      item,
      ...(props as T),
      handleCancel: dialogState?.closeDialog,
      handleReceive,
    });
  };

  return (props: T) => Comp(props);
};
