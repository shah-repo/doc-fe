import { useObserver } from "mobx-react";
import React from "react";
import { useIntl } from "react-intl";
import { FB } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { toastError } from "../../components/notifications";
import { FBActionModel } from "../stores/domain/models/FBActionModel";
import FBActionStore from "../stores/ui/FBActionStore";
import { FBInputProps } from "../types/common";
import { FBEditorElementType } from "../types/editor";
import FBReceivePOAutocompletePresenter from "./FBReceivePOAutocomplete.presenter";


const FBReceivePOAutocompleteContainer: React.FunctionComponent<{}> = ({
  ...props
}) => {
  const intl = useIntl();
  const { receiveState } = FB.useStores();
  useObserver(() => receiveState?.poId);
  const handleChange = async (e, po: DocumentRevision) => {
    const apiCall = new FBActionModel();
    apiCall.set({
      requestMethod: "GET",
      requestUrl: `/document_revisions/${po.id}`,
    });
    const data: DocumentRevision = await FBActionStore.apiCall(apiCall.toJS() as unknown as FBActionModel);

    const schema = data.formDocument?.formTemplate?.schema || [];
    const poFieldName = (schema as FBInputProps[])
      .find((schemaItem) => schemaItem.type as FBEditorElementType  === "purchaseorder")
      ?.name;

    if (!poFieldName) {
      // TODO: agree on alternative for notifications
      toastError(intl.formatMessage({ id: "form.builder.receive.po.not.found" }));
      return;
    }

    receiveState?.setPOId(po.id);
    receiveState?.setItems(
      data.formInput?.[poFieldName]?.items || []
    );
  };

  return (
    <FBReceivePOAutocompletePresenter
      {...props}
      handleChange={handleChange}
      poId={receiveState?.poId}
    />
  );
};

export default FBReceivePOAutocompleteContainer;
