import { get, isUndefined } from "lodash";
import React, { useEffect } from "react";
import { DocumentRevisionFormState, DocumentRevisionSummaryProps, SM, SMProvider } from "../../..";
import { FormScrolledContext } from "../../../../ui/app/Header.presenter";

export const withDocumentRevisionSummaryWrap = <T extends DocumentRevisionSummaryProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onTabChange,
    onScroll,
    _documentRevisionFormState,
    documentRevision,
    isFB,
    ...props
  }: T) => {

    // MARK: @config
    _documentRevisionFormState = SM.useRef(DocumentRevisionFormState);
    const { _tabsState, _formState } = SM.useStores();
    _documentRevisionFormState?.setDocumentRevision(documentRevision);
    const { formInput, formTemplate, formDocument } = documentRevision || {};
    let { schema } = formTemplate || formDocument?.formTemplate || {};
    schema = documentRevision.schema || schema;
    const formFB = formInput || formTemplate || formDocument;
    isFB = !isUndefined(formFB);
    const {
      setIsScorlled,
      setSelectedDocRevDisplayStatus,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    } = React.useContext(FormScrolledContext)!;
    setSelectedDocRevDisplayStatus(documentRevision?.displayStatus);

    // MARK: @state
    useEffect(() => {
      _formState?.setMode("preview");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods
    onTabChange = (_ev, newValue) => {
      _tabsState?.setValue(newValue);
    };

    onScroll = (ev) => {
      if (!_documentRevisionFormState) { return; }
      const pageYOffset = get(ev.target, "scrollTop");
      const isHeaderHidden = pageYOffset > 0;
      if (isHeaderHidden !== _documentRevisionFormState.isHeaderHidden) {
        _documentRevisionFormState.setIsHeaderHidden(isHeaderHidden);
        setIsScorlled(isHeaderHidden);
      }
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
            documentRevision,
            schema,
            isFB,
          }}
        />
      </SMProvider>
    );
  };

  Comp.displayName = "withDocumentRevisionSummaryWrap";
  return (props: T) => Comp(props);
};
