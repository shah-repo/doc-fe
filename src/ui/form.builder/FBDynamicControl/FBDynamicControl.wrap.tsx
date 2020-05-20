import _ from "lodash";
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
    index = 0,
    ...props
  }: T) => {

    dynamicControlState = FB.useRef<FBDynamicControlState>(FBDynamicControlState);

    handleSelect = (control: DocumentRevision) => {
      const newSchema = FBStore.getSchema();
      let schema = control.formTemplate?.schema as FBInputProps[] || [];
      schema = _.map(schema, (schemaItem) => ({
        ...schemaItem,
        name: `${_.kebabCase(schemaItem.label as string || "")}-${FB.uniqid()}`,
      }));
      newSchema.splice(index, 0, ...schema);
      FBStore.setSchema(newSchema);
      editorStore.open = false;
    };

    useObserver(() => {
      controls = dynamicControlState?.data;
      loading = dynamicControlState?.loading;
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
