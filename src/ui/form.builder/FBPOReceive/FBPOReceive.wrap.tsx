
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { FB, FBPOReceiveProps, FBPOReceiveState } from "..";
import { FBDialogState } from "../FBDialog";
import FBStore from "../stores/ui/FBStore";

export const withFBPOReceive = <T extends FBPOReceiveProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    poReceiveState,
    dialogState,
    afterChange,
    loading,
    schema,
    items,
    name,
    po,
    ...props
  }: T) => {

    const formValue = FBStore.getValue(name);
    const { docId } = FBStore;
    const disableAutocomplete = Boolean(docId);
    poReceiveState = FB.useRef<FBPOReceiveState>(FBPOReceiveState, formValue);
    dialogState = FB.useRef<FBDialogState>(FBDialogState);

    useEffect(() => {
      poReceiveState?.fetchReceivedItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [FBStore.document.id]);

    afterChange = (_fieldName: string, value: any) => {
      poReceiveState?.setPOId(value);
    };

    useObserver(() => {
      po = poReceiveState?.data;
      schema = poReceiveState?.schema;
      items = poReceiveState?.items;
      loading = poReceiveState?.loading;
    });

    return Component({
      ...(props as T),
      afterChange,
      poReceiveState,
      dialogState,
      loading,
      schema,
      items,
      name,
      po,
      disableAutocomplete,
    });
  };

  return (props: T) => Comp(props);
};
