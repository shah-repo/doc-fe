import { first, omit } from "lodash";
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
    partTypeDefaultValue,
    childForReviseValue,
    childrenPartsValue,
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
      partTypeDefaultValue = PartType.DocumentRevision;
      childrenPartsValue = first(childrenParts)?.id;
    } else if (childrenPartsForRevise[0]) {
      partTypeDefaultValue = PartType.Document;
      childForReviseValue = childrenPartsForRevise[0].id;
    }
    const ebPartState = FB.useRef(
      FBEBPartState,
      { childrenParts: first(childrenParts)?.id, childrenPartsForRevise: first(childrenPartsForRevise)?.id }
    );
    const { id: ebId } = workspaceState || {};

    useEffect(() => reaction(
      () => ebPartState?.childrenParts,
      (data) => {
        formState?.setFieldValue("childrenParts", data, true, true);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    useEffect(() => reaction(
      () => ebPartState?.childrenPartsForRevise,
      (data) => {
        formState?.setFieldValue("childForRevise", data, true, true);
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
        if (!childPartId || (childPartId !== ebPartState.childrenParts && ebPartState.childrenParts)) { return; }
        const childrenParts = childPartId && childPartId !== "" ? [{ id: childPartId }] : [];
        const body = {
          formInput: omit(formState?.getValues(), "childrenPartsForRevise"),
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
        formState?.setFieldValue("childrenPartsForRevise", childrenPartsForRevise);
        const body = {
          childrenParts: [],
          formInput: {
            ...formState?.getValues(),
            childrenPartsForRevise,
          },
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
        FBAutocompleteAsyncStore.add(FBAutocompleteAsyncOption.availableParts, partId, data);
        formState?.setFieldValue("childrenParts", partId);
        formState?.getInputState("childrenParts")?.setRender();
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
      }
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
      partType = formState?.getInputState("partType")?.value;
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
      partTypeDefaultValue,
      childForReviseValue,
      childrenPartsValue,
      name,
      formState,
      partType,
    });
  };

  Comp.displayName = "withFBEBPart";
  return Comp;
};
