import { find } from "lodash";
import { reaction } from "mobx";
import React, { useEffect } from "react";
import { FB, FBAutocompleteAsyncOption, FBPartsSelectionProps } from "..";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";


export const withFBPartsSelection = <T extends FBPartsSelectionProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    isOutput,
    disabled,
    defaultValue,
    editorConfig,
    index,
    name,
    filteredOptions,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    isOutput = workspaceState?.isOutput;
    disabled = workspaceState?.mode === "preview" || workspaceState?.mode === "formPreview";

    if (!isOutput) {
      defaultValue = editorConfig?.id;
    }

    // MARK: @reactions
    useEffect(() => reaction(
      () => formState?.inputState.get(name || "")?.value,
      (value) => {
        const schemeItem = workspaceState?.getSchemaItemAt(index);
        workspaceState?.setSchemaItem({
          ...schemeItem,
          editorConfig: { id: value },
        });
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => reaction(
      () => FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.docRevByDoc),
      (docRevs: DocumentRevision[]) => {
        const released = find(Array.from(docRevs.values()), (rev) => rev.status === "RELEASED");
        if (!released) { return; }
        formState?.setFieldValue(name, (released).id);
        formState?.getInputState(name || "")?.setRender();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @helpers
    function handleFilter(
      data: DocumentRevision[],
    ) {
      const filteredData = data.filter((e) => e.status === DocumentRevisionStatus.Released);
      return filteredData;
    }

    // MARK: @methods
    filteredOptions = (options) =>
      handleFilter(options);

    // MARK: @methods

    // MARK: @observer

    return Component({
      ...(props as T),
      isOutput,
      disabled,
      defaultValue,
      editorConfig,
      index,
      name,
      filteredOptions,
    });
  };

  Comp.displayName = "withFBPartsSelection";
  return Comp;
};
