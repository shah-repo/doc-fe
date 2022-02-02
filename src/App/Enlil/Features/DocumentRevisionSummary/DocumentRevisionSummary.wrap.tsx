import { get, isUndefined } from "lodash";
import React from "react";
import { DocumentRevisionFormState, DocumentRevisionSummaryProps, SM, SMProvider } from "../../..";

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
    const { _tabsState } = SM.useStores();
    _documentRevisionFormState?.setDocumentRevision(documentRevision);
    const { formInput, formTemplate, formDocument } = documentRevision || {};
    let { schema } = formTemplate || formDocument?.formTemplate || {};
    schema = documentRevision.schema || schema;
    const formFB = formInput || formTemplate || formDocument;
    isFB = !isUndefined(formFB);

    // MARK: @state

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
