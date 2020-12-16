import { first } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { EBPartRequestBody, FB, FBAutocompleteAsyncOption, FBDialogState, FBEBPartForm, FBEBPartProps, FBEBPartState, PartType } from "..";
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
    const { childrenParts = [] } = workspaceState?.document || {};
    const childrenPartsForRevise = workspaceState?.document?.formInput?.childrenPartsForRevise as EBPartRequestBody[];
    if (first(childrenParts) || !first(childrenPartsForRevise)) {
      formState?.setFieldValue("partType", PartType.DocumentRevision, true);
      formState?.getInputState("childForRevise")?.setHidden(true);
    } else if (childrenPartsForRevise[0]) {
      formState?.setFieldValue("partType", PartType.Document, true);
      formState?.setFieldValue("childForRevise", childrenPartsForRevise[0]);
      formState?.getInputState("childrenParts")?.setHidden(true);
    }
    const ebPartState = FB.useRef(
      FBEBPartState,
      { childrenParts: first(childrenParts)?.id, childrenPartsForRevise: first(childrenPartsForRevise)?.id }
    );
    const { id: ebId } = workspaceState || {};

    useEffect(() => reaction(
      () => ebPartState?.childrenParts,
      (data) => formState?.setFieldValue("childrenParts", data), {
        fireImmediately: true,
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => reaction(
      () => ebPartState?.childrenPartsForRevise,
      (data) => formState?.setFieldValue("childForRevise", data), {
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
        const childrenParts = childPartId && childPartId !== "" ? [{ id: childPartId }] : [];
        const body = {
          childrenParts,
        };
        ebPartState.addExistingPartChild(
          ebId,
          body,
        );
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    React.useEffect(() => reaction(
      () => formState?.inputState.get("childForRevise")?.value,
      (childPartId: string) => {
        const childrenPartsForRevise = childPartId && childPartId !== "" ? [{ id: childPartId }] : [];
        const body = {
          childrenParts: [],
          formInput: { childrenPartsForRevise },
        };
        ebPartState.addExistingPartChild(
          ebId,
          body,
        );
      }
    ));

    // on add part
    React.useEffect(() => reaction(
      () => ebPartState.newChildApi.data,
      (data) => {
        // formState?.setFieldValue("partType", "documentRevision", true);
        const { id: partId } = data || {};
        ebPartState.setNewRender(true);
        FBAutocompleteAsyncStore.add(FBAutocompleteAsyncOption.availableParts, partId, data);
        ebPartState?.setChildrenParts(partId);
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // on type radio button change
    React.useEffect(() => reaction(
      () => formState?.getInputState("partType")?.value,
      (value: PartType) => {
        formState?.getInputState("childrenParts")?.setHidden(value !== PartType.DocumentRevision);
        formState?.getInputState("childForRevise")?.setHidden(value === PartType.DocumentRevision);
      },
      { fireImmediately: true }
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
    });

    return Component({
      ...(props as T),
      handleAdd,
      ebPartState,
      dialogState,
      childrenParts,
      childrenPartsForRevise,
      loading,
      disabled,
      forceNewRender: ebPartState?.forceNewRender,
      name,
      formState,
    });
  };

  Comp.displayName = "withFBEBPart";
  return Comp;
};
