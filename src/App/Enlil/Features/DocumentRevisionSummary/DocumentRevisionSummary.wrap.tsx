import { get, isUndefined } from 'lodash';
import React, { useEffect } from 'react';
import { DocumentRevisionFormState, DocumentRevisionSummaryProps, SM, SMProvider } from '../../..';
import { openPOToastr } from '../../../../ui/components/notifications/POStatus';
import { checkIsDocumentPO, checkIsDocumentReceivable } from '../../../../ui/documentRevision/helpers/checkDocumentGroup';
import { FB, FBPOApprovalsState, FBProvider } from '../../../../ui/form.builder';

export const withDocumentRevisionSummaryWrap = <T extends DocumentRevisionSummaryProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
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

    const isPO = checkIsDocumentPO(documentRevision?.document.documentType.groupOptions);
    const isReceivable = checkIsDocumentReceivable(documentRevision?.document?.documentType?.groupOptions);
    const poApprovalsState = isPO ? FB.useRef(
      FBPOApprovalsState,
      {
        id: documentRevision.id,
        approvals: documentRevision?.approvals,
      },
    ) : undefined;

    // MARK: @state
    useEffect(() => {
      const reOpenedPOInfo = localStorage.getItem('reOpenedPOInfo');
      if (isReceivable && reOpenedPOInfo) {
        try {
          openPOToastr(JSON.parse(reOpenedPOInfo));
        } catch {}
        localStorage.removeItem('reOpenedPOInfo');
      }
      _formState?.setMode('preview');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    onScroll = (ev) => {
      if (!_documentRevisionFormState) { return; }
      const pageYOffset = get(ev.target, 'scrollTop');
      const isHeaderHidden = pageYOffset > 0;
      if (isHeaderHidden !== _documentRevisionFormState.isHeaderHidden) {
        _documentRevisionFormState.setIsHeaderHidden(isHeaderHidden);
      }
    };

    return (
      <SMProvider {...{ _documentRevisionFormState }}>
        <FBProvider {...{ poApprovalsState }}>
          <Component
            {...props as T}
            {...{
              onScroll,
              _documentRevisionFormState,
              _tabsState,
              documentRevision,
              schema,
              isFB,
            }}
          />
        </FBProvider>
      </SMProvider>
    );
  };

  Comp.displayName = 'withDocumentRevisionSummaryWrap';
  return (props: T) => Comp(props);
};
