import React from 'react';
import { DocumentRevisionFooterState, SM, SMProvider } from '../../../../..';
import { FBDocumentRevisionProps } from '../../../../../../state/ducks/documentRevisions/types';
import { generateRevisionNumber } from '../../../../../../ui/documentRevision/helpers/generateRevisionNumber';
import { DocumentRevisionFooterProps } from './DocumentRevisionFooter.types';

export const withDocumentRevisionFooterWrap = <T extends DocumentRevisionFooterProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    _documentRevisionFooterState,
    ...props
  }: T) => {

    // MARK: @config
    _documentRevisionFooterState = SM.useRef(DocumentRevisionFooterState);
    const { _formState } = SM.useStores();
    if (_formState?.values?.get('formDocument')) {
      setFormDocument(_formState?.values?.get('formDocument'));
    }
    // MARK: @state

    // MARK: @reactions
    SM.reaction(
      () => _formState?.values?.get('formDocument'),
      (formDocument?: FBDocumentRevisionProps) => setFormDocument(formDocument),
    );

    // MARK: @helpers
    function setFormDocument(formDocument?: FBDocumentRevisionProps) {
      if (!formDocument) {
        _documentRevisionFooterState?.setHidden(true);
        return;
      }
      const {
        revision,
        subRevision,
        revisionStage,
        revisionChangeType,
        releasedAt,
        document: { docId = '' } = {},
      } = formDocument || {};

      const version = generateRevisionNumber(
        revision,
        revisionStage as number,
        subRevision,
        revisionChangeType
      );
      _documentRevisionFooterState?.setInfo({ docId, version, releasedAt });
      _documentRevisionFooterState?.setHidden(false);
    }

    // MARK: @methods

    return (
      <SMProvider {...{ _documentRevisionFooterState }}>
        <Component
          {...props as T}
          {...{ _documentRevisionFooterState }}
        />
      </SMProvider>
    );
  };

  Comp.displayName = 'withDocumentRevisionFooterWrap';
  return (props: T) => Comp(props);
};
