import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBEditorCustomControlProps, FBEditorCustomControlState, FBSchemaProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";


export const withFBEditorCustomControl = <T extends FBEditorCustomControlProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleSelect,
    customControlState,
    controls,
    loading,
    ...props
  }: T) => {

    const { workspaceState, dialogState } = FB.useStores();
    customControlState = FB.useRef<FBEditorCustomControlState>(FBEditorCustomControlState);

    handleSelect = (control: DocumentRevision) => {
      const schema = control.formTemplate?.schema as FBSchemaProps[] || [];
      _.map(schema, (schemaItem) => ({
        ...schemaItem,
        name: FB.uniqid,
      }));
      workspaceState?.setSchema(_.union(workspaceState.getSchema(), schema));
      dialogState?.closeDialog();
    };

    useObserver(() => {
      controls = customControlState?.data;
      loading = customControlState?.loading;
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
