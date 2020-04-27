import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBForm } from "../";
import { FBSchemaProps } from "../FBSchema";

export let SelectedItem: React.Context<any>;

const FBReceivePOSchema: React.FunctionComponent<any> = ({
  ...props
}) => {
  const { receiveState } = FB.useStores();
  useObserver(() => receiveState?.poSchema);

  if (receiveState?.poSchema.length === 0) {
    return null;
  }

  return (
    <FBForm schema={receiveState?.poSchema as FBSchemaProps[]} initialValues={receiveState?.poFormInput} />
  );
};

export default FBReceivePOSchema;
