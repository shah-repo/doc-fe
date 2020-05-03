
import { useObserver } from "mobx-react";
import React from "react";
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
    poReceiveState = FB.useRef<FBPOReceiveState>(FBPOReceiveState, formValue);
    dialogState = FB.useRef<FBDialogState>(FBDialogState);

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
    });
  };

  return (props: T) => Comp(props);
};
