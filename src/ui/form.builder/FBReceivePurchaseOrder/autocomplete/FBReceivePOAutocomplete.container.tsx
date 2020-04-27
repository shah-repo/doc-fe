import { useObserver } from "mobx-react";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { FB } from "../..";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import { toastError } from "../../../components/notifications";
import { FBActionModel } from "../../stores/domain/models/FBActionModel";
import FBActionStore from "../../stores/ui/FBActionStore";
import { FBInputProps } from "../../types/common";
import { FBEditorElementType } from "../../types/editor";
import FBReceivePOAutocompletePresenter from "./FBReceivePOAutocomplete.presenter";


const FBReceivePOAutocompleteContainer: React.FunctionComponent<{}> = ({
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const intl = useIntl();
  const { receiveState } = FB.useStores();
  useObserver(() => receiveState?.poId);
  const handlePOSchema = (document: DocumentRevision) => {
    const schema = (document.formDocument?.formTemplate?.schema || []) as FBInputProps[];
    const poSchema = schema.reduce<FBInputProps[]>((acc, schemaItem: FBInputProps) => {
      if ((schemaItem.type as FBEditorElementType === "purchaseorder") || !schemaItem.name) {
        return acc;
      }
      schemaItem.disabled = true;
      return acc.concat(schemaItem);
    }, []);
    const fieldNames: string[] = poSchema.map((item) => item.name as string);
    const poFormInput = fieldNames.reduce((acc, name) => {
      acc[name] = document.formInput?.[name];
      return acc;
    }, {});

    receiveState?.setFieldNames(fieldNames);
    receiveState?.setPOFormInput(poFormInput);
    receiveState?.setPOSchema(poSchema);

    receiveState?.updateSchema();
    receiveState?.updateFormInput();
  };
  const handleChange = async (e, po?: DocumentRevision) => {
    receiveState?.clear();
    if (!po) {
      return;
    }

    setIsLoading(true);

    const apiCall = new FBActionModel();
    apiCall.set({
      requestMethod: "GET",
      requestUrl: `/document_revisions/${po.id}`,
    });
    const data: DocumentRevision = await FBActionStore.apiCall(apiCall.toJS() as unknown as FBActionModel);

    receiveState?.setPODocument(data);
    receiveState?.setPOId(po.id);
    setIsLoading(false);

    const schema = (data.formDocument?.formTemplate?.schema || []) as FBInputProps[];
    const poFieldName = schema
      .find((schemaItem) => schemaItem.type as FBEditorElementType  === "purchaseorder")
      ?.name;

    if (!poFieldName) {
      // TODO: agree on alternative for notifications
      toastError(intl.formatMessage({ id: "form.builder.receive.po.not.found" }));
      return;
    }

    receiveState?.setItems(
      data.formInput?.[poFieldName]?.items || []
    );

    handlePOSchema(data);
  };

  return (
    <FBReceivePOAutocompletePresenter
      {...props}
      handleChange={handleChange}
      poId={receiveState?.poId}
      isLoading={isLoading}
    />
  );
};

export default FBReceivePOAutocompleteContainer;
