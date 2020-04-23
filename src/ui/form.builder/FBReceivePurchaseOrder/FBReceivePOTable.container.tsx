import { useObserver } from "mobx-react";
import React from "react";
import { FB } from "..";
import FBReceivePOTablePresenter from "./FBReceivePOTable.presenter";


const FBReceivePOTableContainer: React.FunctionComponent<any> = ({
  ...props
}) => {
  const { receiveState } = FB.useStores();
  useObserver(() => receiveState?.items);
  const handleEdit = (index, item) => {
    console.log(index);
    console.log(item);
  };

  if (receiveState?.items.length === 0) {
    return null;
  }

  return (
    <FBReceivePOTablePresenter
      {...props}
      items={receiveState?.items}
      handleEdit={handleEdit}
    />
  );
};

export default FBReceivePOTableContainer;
