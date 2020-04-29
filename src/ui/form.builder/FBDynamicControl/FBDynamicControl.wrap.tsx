import _ from "lodash";
import { autorun } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDynamicControlProps, FBDynamicControlState } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import editorStore from "../stores/ui/FBEditorStore";
import FBStore from "../stores/ui/FBStore";
import { FBInputProps } from "../types/common";


export const withFBDynamicControl = <T extends FBDynamicControlProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleSelect,
    dynamicControlState,
    controls,
    loading,
    ...props
  }: T) => {

    dynamicControlState = FB.useRef<FBDynamicControlState>(FBDynamicControlState);

    handleSelect = (control: DocumentRevision) => {
      dynamicControlState?.setControlUrl(control.id);
    };

    autorun(() => {
      if (dynamicControlState?.controlApi.data) {
        const control = dynamicControlState?.controlApi.data;
        const docSchema =
        control.formTemplate?.schema as FBInputProps[] ||
        control.formDocument?.formDocument?.formTemplate?.schema as FBInputProps[] ||
        [];
        FBStore.setSchema(_.union(FBStore.getSchema(), docSchema));
        editorStore.open = false;
      }
    });

    useObserver(() => {
      controls = dynamicControlState?.data;
      loading = dynamicControlState?.loading || dynamicControlState?.controlApi.loading;
    });

    return Component({
      ...(props as T),
      handleSelect,
      controls,
      loading,
    });
  };

  return (props: T) => Comp(props);
};
