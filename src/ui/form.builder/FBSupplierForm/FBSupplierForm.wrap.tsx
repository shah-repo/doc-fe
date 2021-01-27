import { first } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { EBPartPostBody, FB, FBFormState, FBSupplierFormActions, FBSupplierFormProps } from "..";

export const withFBSupplierForm = <T extends FBSupplierFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onDialogConfirm,
    onDialogClose,
    disabled,
    loading,
    formOptions,
    formAutocompleteDisabled,
    ...props
  }: T) => {

    // MARK: @config
    const { dialogState, supplierState } = FB.useStores();
    const formState = FB.useRef<FBFormState>(FBFormState, {});

    React.useEffect(() => dialogState?.setActions(
      <FBSupplierFormActions
        {...{ onDialogConfirm, onDialogClose, disabled: supplierState?.proposedDocIdApi.loading }}
      />
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [supplierState?.proposedDocIdApi.loading]);

    // MARK: @methods
    onDialogConfirm = () => {
      const formValue = formState.getValues();
      supplierState?.addNewSupplier(formValue as EBPartPostBody);
      onDialogClose?.();
    };

    const setFormDocument = (value?: string) => {
      formState?.setFieldValue("formDocument.id", value);
      formState?.getInputState("formDocument.id")?.setRender();
      formState?.validate();
    };

    onDialogClose = () => dialogState?.closeDialog();

    // MARK: @reactions
    // on document type autocomplete change
    React.useEffect(() => reaction(
      () => formState?.inputState.get("document.documentType.id")?.value,
      (data) => {
        setFormDocument(undefined);
        if (!data || !FB.isUUID(data)) { return; }
        supplierState?.fetchProposedDocId(data);
        supplierState?.fetchDocumentType(data);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // on fetch proposed doc id
    React.useEffect(() => reaction(
      () => supplierState?.proposedDocIdApi.data,
      (data) => formState.setFieldValue("document.docId", data?.docId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // on fetch document type
    React.useEffect(() => reaction(
      () => supplierState?.documentTypeApi.data,
      (data) => {
        const forms = data?.forms;

        // auto select first form if it's the only one
        if (forms?.length === 1) {
          setFormDocument(first(forms)?.id);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @observer
    useObserver(() => {
      loading = (
        supplierState?.newSupplierApi.loading ||
        supplierState?.proposedDocIdApi.loading ||
        supplierState?.documentTypeApi.loading
      );
      disabled = disabled || loading;

      // disable Choose a Form Autocomplete if document type isn't selected
      formAutocompleteDisabled = !FB.isUUID(formState?.getInputState("document.documentType.id")?.value);

      // map forms from fetched document type
      formOptions = supplierState?.documentTypeApi.data?.forms;
    });

    return Component({
      ...(props as T),
      formState,
      disabled,
      loading,
      formOptions,
      formAutocompleteDisabled,
    });
  };

  Comp.displayName = "withFBSupplierForm";
  return Comp;
};
