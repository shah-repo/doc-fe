import { get } from "lodash";
import React, { useEffect } from "react";
import { DocumentRevisionFormProps, DocumentRevisionFormState, SM, SMProvider } from "../../..";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions/types";
import { FormScrolledContext } from "../../../../ui/app/Header.presenter";
import { isDocumentRevisionReleased } from "../../../../ui/documentRevision/helpers/documentRevisionStatus";

export const withDocumentRevisionFormWrap = <T extends DocumentRevisionFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onTabChange,
    onScroll,
    _documentRevisionFormState,
    document,
    autosaveEnabled,
    ...props
  }: T) => {

    // MARK: @config
    _documentRevisionFormState = SM.useRef(DocumentRevisionFormState);
    const { _formState, _tabsState } = SM.useStores();
    _documentRevisionFormState?.setFormAutosave(autosaveEnabled);
    _formState?.setAutosave(autosaveEnabled);

    const {
      setIsScorlled,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    } = React.useContext(FormScrolledContext)!;
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
    onTabChange = (_ev, newValue) => {
      _tabsState?.setValue(newValue);
    };

    onScroll = (ev) => {
      if (!_documentRevisionFormState) { return; }
      const el = ev.target;
      const pageYOffset = get(el, "scrollTop");

      setTimeout(() => {
        const elY = get(el, "scrollTop");
        if (pageYOffset > 0 && pageYOffset < elY && !_documentRevisionFormState?.isHeaderHidden) {
          setIsScorlled(true);
          _documentRevisionFormState?.setIsHeaderHidden(true);
        }
        if (pageYOffset === 0 && elY === 0 && _documentRevisionFormState?.isHeaderHidden) {
          _documentRevisionFormState?.setIsHeaderHidden(false);
          setIsScorlled(false);
        }
      }, 250);
    };

    return (
      <SMProvider {...{ _documentRevisionFormState }}>
        <Component
          {...props as T}
          {...{
            onTabChange,
            onScroll,
            _documentRevisionFormState,
            _tabsState,
            _formState,
            autosaveEnabled,
          }}
        />
      </SMProvider>
    );
  };

  Comp.displayName = "withDocumentRevisionFormWrap";
  return (props: T) => Comp(props);
};
