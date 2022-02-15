import { isEmpty, map } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { useDispatch } from "react-redux";
import { FB, FBDialogState, FBPurchaseOrderActions, FBPurchaseOrderForm, FBPurchaseOrderItem, FBPurchaseOrderProps, FBPurchaseOrderState, FBPurchaseOrderValue } from "..";
import { Id } from "../../../state/ducks/common/types";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { RevisionChangeType } from "../../../state/ducks/documentRevisions/types";
import { checkIsDocumentReceivable } from "../../documentRevision/helpers/checkDocumentGroup";

export const withFBPurchaseOrder = <T extends FBPurchaseOrderProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleItem,
    handleLot,
    purchaseOrderState,
    defaultValue,
    dialogState,
    disabled,
    receivableName,
    name,
    ...props
  }: T) => {

    const dispatch = useDispatch();
    const { workspaceState, formState, poReceiveState } = FB.useStores();
    const formValue = formState?.getFieldValue(name, defaultValue);
    const isReceivable = checkIsDocumentReceivable(workspaceState?.document?.document.documentType.groupOptions);
    purchaseOrderState = FB.useRef<FBPurchaseOrderState>(FBPurchaseOrderState, {
      ...formValue,
      documentId: isReceivable ? poReceiveState?.data?.documentId : workspaceState?.document?.document?.id,
    });
    dialogState = FB.useRef<FBDialogState>(FBDialogState);

    useObserver(() => {
      disabled = workspaceState?.revisionChangeType === RevisionChangeType.AdministrativeChange || disabled;
    });

    !handleItem && (handleItem = (item?: FBPurchaseOrderItem) => {
      if (disabled && !(workspaceState?.isDraft || workspaceState?.isPendingChange)) {
        return;
      }
      purchaseOrderState?.setItemTotalAmount(item);
      dialogState?.config({
        open: true,
        maxWidth: "sm",
        title: "form.builder.add.item",
        content: (
          <FBPurchaseOrderForm initialValues={item} />
        ),
        actions: <FBPurchaseOrderActions />,
      });
    });

    async function handleReceiveAll() {
      if (!workspaceState?.documentId) {
        return;
      }
      if (!receivableName) { return; }
      const { items } = formState?.getFieldValue(name) as FBPurchaseOrderValue;
      const receivedItems = map(items, (item) => ({
        itemId: item.partNumber || item.id,
        received: item.order || 0,
      }));

      const hasNoReference = isEmpty(workspaceState.document?.referenceTo.find(
        (e) => e.id === poReceiveState?.data?.document.id));

      const receivedItemsInput = {
        ...workspaceState.document?.formInput,
        [receivableName]: {
          ...workspaceState.document?.formInput?.[receivableName],
          receivedItems,
        },
      };

      poReceiveState?.addReceiveQuantity(workspaceState.id, {
        formInput: receivedItemsInput,
        referenceTo: hasNoReference ?
          [{
            ...workspaceState.document?.referenceTo,
            id: poReceiveState?.data?.document.id,
          }] as Id[] : undefined,
      });
      await poReceiveState?.setPOId(poReceiveState?.data?.id);
      dispatch(documentRevisionsActions.reload(workspaceState?.document?.id as string));
    }

    return Component({
      ...(props as T),
      handleItem,
      handleLot,
      handleReceiveAll,
      purchaseOrderState,
      dialogState,
      disabled,
      name,
      isReceivable,
    });
  };

  return (props: T) => Comp(props);
};


