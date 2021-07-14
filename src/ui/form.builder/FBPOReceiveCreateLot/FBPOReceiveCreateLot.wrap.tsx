import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FB, FBPOReceiveCreateLotProps } from "..";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { documentTypeActions, documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { DocumentTypeById, DocumentTypeByIdForm } from "../../../state/ducks/documentRevisions/documentType/types";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { getReceivedQuantity } from "../FBPOReceive/utils";
import FBPOReceiveCreateLotState from "./FBPOReceiveCreateLot.state";

export const withFBPOReceiveCreateLot = <T extends FBPOReceiveCreateLotProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleCancel,
    handleCreateLot,
    item,
    ...props
  }: T) => {
    const dispatch = useDispatch();

    const { dialogState, formState, workspaceState, poReceiveState } = FB.useStores();
    const receivableId = workspaceState?.document?.id as string;
    const name = workspaceState?.schema?.find((e) => e.type === "poreceive")?.name as string;
    const receivedItems = workspaceState?.getFieldByName(name).receivedItems ?? [];
    const id = item?.partNumber || item?.id;
    const lotQuantity = getReceivedQuantity(receivedItems, id);

    const lotItem = {
      ...item,
      received: lotQuantity,
    };

    const createLotState = FB.useRef<FBPOReceiveCreateLotState>(
      FBPOReceiveCreateLotState,
      { receivableId, item: lotItem }
    );

    handleCreateLot = async ()  => {
      const values = formState?.getValues();
      await createLotState.submit(values);
      dialogState?.closeDialog();
      await poReceiveState?.setPOId(poReceiveState?.data?.id);
      dispatch(documentRevisionsActions.reload(workspaceState?.document?.id as string));
    };

    const getDocTypesByCategory = useActionCreator(documentTypeActions.getDocTypesByCategory);
    const getDocRevByIds = useActionCreator(documentTypeActions.getDocTypeIds);
    const documentTypes = useSelector(documentTypeSelectors.getDocumentTypesByCategory);
    const [formIds, setFormIds] = useState<DocumentTypeByIdForm[]>();

    const idAsync = useAsync<DocumentTypeById>({
      onSuccess: (documents) => {
        setFormIds(documents?.forms);
      },
    });

    const categoryAsync = useAsync<DocumentType[]>();

    const getDocTypes = () => {
      categoryAsync.start(getDocTypesByCategory, { category: "Lot" }, categoryAsync);
    };

    const handleDocTypeSelection = (e, value) => {
      e.stopPropagation();
      if (!value?.value) {
        return;
      }
      idAsync.start(getDocRevByIds, value?.value, idAsync);
    };

    useEffect(() => {
      getDocTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Component({
      ...(props as T),
      handleCancel: dialogState?.closeDialog,
      handleCreateLot,
      handleDocTypeSelection,
      formIds,
      documentTypes,
      item: lotItem,
    });
  };

  return (props: T) => Comp(props);
};
