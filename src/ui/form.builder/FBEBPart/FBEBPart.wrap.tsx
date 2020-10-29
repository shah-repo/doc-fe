import { omit, set } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDialogState, FBEBPartForm, FBEBPartProps, FBEBPartState, FBFormState } from "..";
import { getHighestRevision } from "../../documentRevision/forms/transform";

export const withFBEBPart = <T extends FBEBPartProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    name,
    ...props
  }) => {
    // MARK: @config
    let loading = false;
    let disabled = false;
    const dialogState = FB.useRef(FBDialogState);
    const { workspaceState } = FB.useStores();
    const ebPartState = FB.useRef(
      FBEBPartState,
      workspaceState?.document?.childrenParts,
    );
    const childrenParts = workspaceState?.document?.childrenParts?.[0];
    React.useEffect(() => {
      const childrenPartsForRevise = workspaceState?.document?.formInput?.childrenPartsForRevise?.[0];
      if (!childrenParts && childrenPartsForRevise) {
        ebPartState.fetchDocumentById(childrenPartsForRevise.id);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const formState = FB.useRef(FBFormState, { initialValues: { childrenParts } });
    const { id: ebId } = workspaceState || {};

    // MARK: @methods
    const onAddClick = () => {
     dialogState?.config({
       title: "form.builder.create.new.part",
       open: true,
       content: <FBEBPartForm { ...{ name, ebId, ebPartState }}  />,
     });
    };

    // MARK: @reactions
    // on existing part autocomplete change
    React.useEffect(() => reaction(
      () => formState?.inputState.get("childrenParts")?.value,
      (childPartId: string) => {
        ebPartState.addExistingPartChild(ebId, childPartId);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);
    // on add part
    React.useEffect(() => reaction(
      () => ebPartState.newChildApi.data,
      (data) => {
        formState?.setFieldValue("childrenParts", data);
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);
    // on fetch doc by id
    React.useEffect(() => reaction(
      () => ebPartState.documentApi.data,
      (data) => {
        const childrenParts = getHighestRevision(data?.documentRevisions || []);
        set(childrenParts || {}, "document", omit(data, "documentRevisions"));
            formState?.setFieldValue("childrenParts", childrenParts);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @observer
    useObserver(() => {
      loading = (
        ebPartState?.loading
        || ebPartState?.newChildApi.loading
        || ebPartState?.existingChildApi.loading
        || ebPartState?.documentApi.loading
        || ebPartState?.proposedDocIdApi.loading
      );
      disabled = disabled || loading;
    });

    return Component({
      ...(props as T),
      loading,
      disabled,
      onAddClick,
      dialogState,
      formState,
    });
  };

  Comp.displayName = "withFBEBPart";
  return Comp;
};
