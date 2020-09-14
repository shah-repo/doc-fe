import { map } from "lodash";
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
    index = 0,
    ...props
  }: T) => {

    const { workspaceState, dialogState } = FB.useStores();
    customControlState = FB.useRef<FBEditorCustomControlState>(FBEditorCustomControlState);

    handleSelect = (control: DocumentRevision) => {
      const newSchema = workspaceState?.getSchema();
      const schema = control.formTemplate?.schema as FBSchemaProps[] || [];
      map(schema, (schemaItem) => ({
        ...schemaItem,
        name: FB.uniqid,
      }));
      newSchema?.splice(index, 0, ...schema);
      workspaceState?.setSchema(newSchema);
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
