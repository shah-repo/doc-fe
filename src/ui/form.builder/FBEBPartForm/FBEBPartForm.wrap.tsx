import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { EBPartPostBody, FB, FBEBPartFormActions, FBEBPartFormProps, FBFormState } from "..";

export const withFBEBPartForm = <T extends FBEBPartFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onDialogConfirm,
    onDialogClose,
    disabled,
    loading,
    ebId,
    formOptions,
    formAutocompleteDisabled,
    ...props
  }: T) => {

    // MARK: @config
    const { dialogState, ebPartState } = FB.useStores();
    const formState = FB.useRef<FBFormState>(FBFormState, {});

    React.useEffect(() => dialogState?.setActions(
      <FBEBPartFormActions
        {...{ onDialogConfirm, onDialogClose, disabled: ebPartState?.proposedDocIdApi.loading }}
      />
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [ebPartState?.proposedDocIdApi.loading]);

    // MARK: @methods
    onDialogConfirm = () => {
      const formValue = formState.getValues();
      ebPartState?.addNewPartChild(formValue as EBPartPostBody);
      onDialogClose?.();
    };

    onDialogClose = () => dialogState?.closeDialog();

    // MARK: @reactions
    // on document type autocomplete change
    React.useEffect(() => reaction(
      () => formState?.inputState.get("document.documentType.id")?.value,
      (data) => {
        formState.setFieldValue("formDocument.id", undefined, true);
        ebPartState?.fetchProposedDocId(data);
        ebPartState?.fetchFormsForDocType(data);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // on fetch proposed doc id
    React.useEffect(() => reaction(
      () => ebPartState?.proposedDocIdApi.data,
      (data) => formState.setFieldValue("document.docId", data?.docId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @observer
    useObserver(() => {
      loading = ebPartState?.proposedDocIdApi.loading
        || ebPartState?.documentTypeApi.loading
        || ebPartState?.loading;
      disabled = disabled || loading;
      formAutocompleteDisabled = !FB.isUUID(formState?.getInputState("document.documentType.id")?.value);

      formOptions = ebPartState?.formOptions;
      if (formOptions?.length === 1) {
        formState.setFieldValue("formDocument.id", formOptions[0].value, true);
      }
    });

    return Component({
      ...(props as T),
      formState,
      ebId,
      disabled,
      loading,
      formOptions,
      formAutocompleteDisabled,
    });
  };

  Comp.displayName = "withFBEBPartForm";
  return Comp;
};
