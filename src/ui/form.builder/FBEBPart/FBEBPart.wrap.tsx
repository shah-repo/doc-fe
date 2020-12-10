import { first, omit, set } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { FB, FBAutocompleteAsyncOption, FBDialogState, FBEBPartForm, FBEBPartProps, FBEBPartState } from "..";
import { getHighestRevision } from "../../documentRevision/forms/transform";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

export const withFBEBPart = <T extends FBEBPartProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    handleAdd,
    loading = false,
    disabled = false,
    defaultValue,
    forceNewRender,
    partType,
    name,
    optionId,
    ...props
  }: T) => {
    // MARK: @config
    const dialogState = FB.useRef(FBDialogState);
    const { workspaceState, formState } = FB.useStores();
    const { document: { childrenParts: additionalData = [] } = {} } = workspaceState || {};
    const ebPartState = FB.useRef(FBEBPartState, first(additionalData)?.id);
    const { id: ebId } = workspaceState || {};
    partType = "documentRevision";

    useEffect(() => {
      const childrenPartsForRevise = workspaceState?.document?.formInput?.childrenPartsForRevise;
      if (!workspaceState?.document?.childrenParts?.length && childrenPartsForRevise?.[0]) {
        ebPartState.fetchDocumentById(childrenPartsForRevise[0].id);
        formState?.setFieldValue("partType", "document");
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => reaction(
      () => ebPartState?.childrenParts,
      (data) => formState?.setFieldValue("childrenParts", data), {
        fireImmediately: true,
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);


    // MARK: @methods
    handleAdd = () => dialogState?.config({
      open: true,
      title: "form.builder.create.new.part",
      content: <FBEBPartForm { ...{ ebId }}  />,
    });

    // MARK: @reactions
    // on existing part autocomplete change
    React.useEffect(() => reaction(
      () => formState?.inputState.get("childrenParts")?.value,
      (childPartId: string) => {
        const type = formState?.inputState.get("partType")?.value;
        const body = type === "document" ? {
          formInput: {
            childrenPartsForRevise: [{ id: childPartId }],
          },
          childrenParts: [],
        } : {
          childrenParts: [{ id: childPartId }],
          formInput: {
            childrenPartsForRevise: [],
          },
        };
        ebPartState.addExistingPartChild(
          ebId,
          body,
        );
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // on add part
    React.useEffect(() => reaction(
      () => ebPartState.newChildApi.data,
      (data) => {
        const { id: partId } = data || {};
        ebPartState.setNewRender(true);
        FBAutocompleteAsyncStore.add(FBAutocompleteAsyncOption.availableParts, partId, data);
        ebPartState?.setChildrenParts(partId);
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // on fetch doc by id
    React.useEffect(() => reaction(
      () => ebPartState.documentApi.data,
      (data) => {
        const childrenParts = getHighestRevision(data?.documentRevisions || []);
        const { id: partId } = childrenParts || {};
        set(childrenParts || {}, "document", omit(data, "documentRevisions"));
        ebPartState.setNewRender(true);
        FBAutocompleteAsyncStore.add(FBAutocompleteAsyncOption.availableParts, partId, childrenParts);
        ebPartState?.setChildrenParts(partId);

      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // on type radio button change
    React.useEffect(() => reaction(
      () => formState?.inputState.get("partType")?.value,
      () => {
        formState?.setFieldValue(name, undefined, true);
        console.log(name, formState?.values);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @observer
    useObserver(() => {
      loading = (
        ebPartState?.newChildApi.loading ||
        ebPartState?.existingChildApi.loading ||
        ebPartState?.documentApi.loading
      );
      disabled = disabled || loading;
      if (formState?.inputState.get("partType")?.value === "document") {
        optionId = FBAutocompleteAsyncOption.availablePartDocuments;
      } else {
        optionId = FBAutocompleteAsyncOption.availableParts;
      }
    });

    return Component({
      ...(props as T),
      handleAdd,
      ebPartState,
      dialogState,
      additionalData,
      loading,
      disabled,
      forceNewRender: ebPartState?.forceNewRender,
      name,
      partType,
      formState,
      optionId,
    });
  };

  Comp.displayName = "withFBEBPart";
  return Comp;
};
