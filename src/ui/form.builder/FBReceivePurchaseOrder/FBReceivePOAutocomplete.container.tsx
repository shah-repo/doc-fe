import React from "react";
import { FB } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { FBActionModel } from "../stores/domain/models/FBActionModel";
import FBActionStore from "../stores/ui/FBActionStore";
import FBReceivePOAutocompletePresenter from "./FBReceivePOAutocomplete.presenter";


const FBReceivePOAutocompleteContainer: React.FunctionComponent<{}> = ({
  ...props
}) => {
  const stores = FB.useStores();
  console.log(stores);
  console.log(FB);
  const handleChange = async (e, po: Partial<DocumentRevision>) => {
    const apiCall = new FBActionModel();
    apiCall.set({
      requestMethod: "GET",
      requestUrl: `/document_revisions/${po.id}`,
    });
    const data = await FBActionStore.apiCall(apiCall.toJS() as unknown as FBActionModel);

    // receiveState.setLineItems([]);

    console.log(data);
  };
  return (
    <FBReceivePOAutocompletePresenter {...props} handleChange={handleChange} />
  );
};

export default FBReceivePOAutocompleteContainer;
