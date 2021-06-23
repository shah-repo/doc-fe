import React, { useState } from "react";
import { FB, FBPOReceiveCreateLotProps } from "..";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { documentTypeActions, documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { DocumentTypeById, DocumentTypeByIdForm } from "../../../state/ducks/documentRevisions/documentType/types";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";
import FBPOReceiveCreateLotState from "./FBPOReceiveCreateLot.state";
import { useEffect } from "react";

export const withFBPOReceiveCreateLot = <T extends FBPOReceiveCreateLotProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleCancel,
    handleCreateLot,
    item,
    ...props
  }: T) => {

    const { dialogState, formState, workspaceState } = FB.useStores();
    const receivableId = workspaceState?.document?.id as string;
    const createLotState = FB.useRef<FBPOReceiveCreateLotState>(
      FBPOReceiveCreateLotState,
      { receivableId, item }
    );

    handleCreateLot = async ()  => {
      const values = formState?.getValues();
      await createLotState.submit(values);
      dialogState?.closeDialog();
    };

    const getDocTypesByCategory = useActionCreator(documentTypeActions.getDocTypesByCategory);
    const getDocRevByIds = useActionCreator(documentTypeActions.getDocTypeIds);
    const documentTypes = useSelector(documentTypeSelectors.getDocumentTypesByCategory);
    const [formIds, setFormIds] = useState<DocumentTypeByIdForm[]>();

    const idAsync = useAsync<DocumentTypeById>({
      onSuccess: (documents) => {
        setFormIds(documents?.forms);
        if (isEmpty(documents?.forms)) {
          return;
        }
      },
    });

    const categoryAsync = useAsync<DocumentType[]>({
      onSuccess: () => {
        if (documentTypes.length === 1) {
          idAsync.start(getDocRevByIds, documentTypes[0].id, idAsync);
          return;
        }
      },
    });

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
    }, []);

    return Component({
      ...(props as T),
      handleCancel: dialogState?.closeDialog,
      handleCreateLot,
      handleDocTypeSelection,
      formIds,
      documentTypes,
      item,
    });
  };

  return (props: T) => Comp(props);
};
