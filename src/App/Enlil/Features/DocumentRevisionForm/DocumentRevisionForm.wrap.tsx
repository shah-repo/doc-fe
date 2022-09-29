import { useFormikContext } from "formik";
import { cloneDeep, get, isEmpty } from "lodash";
import React, { useCallback, useEffect } from "react";
import { DocumentRevisionFormProps, DocumentRevisionFormState, SM, SMProvider } from "../../..";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions/types";
import { DOCUMENT_REVISION_CREATE_URL } from "../../../../ui/constants/urls";
import { isDocumentRevisionReleased } from "../../../../ui/documentRevision/helpers/documentRevisionStatus";
import { FB, FBApprovalMatrixFieldState, FBDAMFields, FBDocTypeGroup, FBEditorState, FBFormState, FBProvider, FBWorkspaceState } from "../../../../ui/form.builder";
import FBLeftPanelState from "../../../../ui/form.builder/FBLeftPanel/FBLeftPanel.state";
import FBStore from "../../../../ui/form.builder/FBStore/FBStore";

export const withDocumentRevisionFormWrap = <T extends DocumentRevisionFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onTabChange,
    onScroll,
    _documentRevisionFormState,
    document,
    autosaveEnabled,
    isCreateUrl,
    ...props
  }: T) => {
    const formik = useFormikContext();
    // MARK: @config
    _documentRevisionFormState = SM.useRef(DocumentRevisionFormState);
    const { _formState, _tabsState } = SM.useStores();
    const leftPanelState = FB.useRef<FBLeftPanelState>(FBLeftPanelState);
    const editorState = FB.useRef<FBEditorState>(FBEditorState);
    const formState = FB.useRef<FBFormState>(FBFormState, {});
    const { approvalMatrixFieldState } = FB.useStores();
    isCreateUrl = SM.pathname.includes(DOCUMENT_REVISION_CREATE_URL);
    const workspaceState = FB.useRef<FBWorkspaceState>(FBWorkspaceState, {
      schema: _documentRevisionFormState?.schema,
      mode: _formState?.mode,
      autosave: _formState?.autosave || false,
    });
    const { document: { outputRevision = false } = {} } = workspaceState || {};

    const getDAMPayload = useCallback((damData) => ({
      [FBDAMFields.DAM]: damData?.["approvalMatrix"],
      [FBDAMFields.DAR]: damData?.["approvalRoles"],
    }), []);

    if (props.isDAM && !isEmpty(FBStore.damData?.approvalMatrix)) {
      props.formInput = { ...props?.formInput, ...getDAMPayload(FBStore.damData) };
    }
    const approvalMatrixState = (props.isDAM && !approvalMatrixFieldState) ? (
      FB.useRef<FBApprovalMatrixFieldState>(FBApprovalMatrixFieldState, {
        formValue: cloneDeep(props?.formInput),
        outputRevision,
        isOutput: props.isDAM,
      })) : undefined;
    _documentRevisionFormState?.setFormAutosave(autosaveEnabled);
    _formState?.setAutosave(autosaveEnabled);
    SM.reaction(
      () => approvalMatrixState?.data,
      (data) => {
        if (_documentRevisionFormState?.documentType?.group === FBDocTypeGroup.DAM) {
          formik.setFieldValue("formInput", getDAMPayload(data));
          _formState?.setValue("formInput", getDAMPayload(data));
          FBStore.damData = cloneDeep(data);
          formik.submitForm();
        }
      }
    );
    useEffect(() => {
      if (!document?.id) { return; }
      const releasedDocument = (document?.documentRevisions).find((doc) => isDocumentRevisionReleased(doc.status));
      _documentRevisionFormState?.setReleasedDocRev(releasedDocument);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [document?.documentRevisions]);

    // MARK: @state

    // MARK: @reactions
    SM.reaction(
      () => _formState?.values,
      () => {
        const documentRevision = _formState?.getValues() as DocumentRevision;
        if (!_documentRevisionFormState) { return; }
        _documentRevisionFormState.setDocumentRevision(documentRevision);
        // Set the FB schema
        let schema = get(documentRevision, "formTemplate.schema");
        if (!schema) {
          schema = get(documentRevision, "schema");
        }
        if (!schema) {
          schema = get(documentRevision, "formDocument.formTemplate.schema");
        }
        _documentRevisionFormState.formSchema = schema;
      },
      { fireImmediately: true }
    );

    SM.reaction(
      () => _formState?.mode,
      (mode) => _documentRevisionFormState?.setFormMode(mode || "none"),
      { fireImmediately: true }
    );

    SM.reaction(
      () => _documentRevisionFormState?.loading,
      (loading) => _formState?.setLoading(loading)
    );

    SM.reaction(
      () => _documentRevisionFormState?.formSchema,
      (schema) => {
        if (_formState?.mode === "design") {
          _formState?.setValue("formTemplate.schema", schema);
          return;
        }
        if (_formState?.mode === "formDesign" && _documentRevisionFormState?.isOutputSchema) {
          _formState?.setValue("schema", schema);
        }
      }
    );
    // MARK: @helpers

    // MARK: @methods
    onTabChange = (_ev, newValue, tabConfig) => {
      _tabsState?.setValue(newValue);
      _tabsState?.setTabID(tabConfig[newValue].tabId);
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onScroll = () => {};

    return (
      <SMProvider {...{ _documentRevisionFormState }}>
        <FBProvider {...{
          leftPanelState, editorState, formState, workspaceState,
          approvalMatrixFieldState: approvalMatrixState,
        }}>
          <Component
            {...props as T}
            {...{
              onTabChange,
              onScroll,
              _documentRevisionFormState,
              _tabsState,
              _formState,
              autosaveEnabled,
              schema: props?.documentRevision?.schema || _documentRevisionFormState?.schema,
              workspaceState,
              isCreateUrl,
            }}
          />
        </FBProvider>
      </SMProvider>
    );
  };

  Comp.displayName = "withDocumentRevisionFormWrap";
  return (props: T) => Comp(props);
};
