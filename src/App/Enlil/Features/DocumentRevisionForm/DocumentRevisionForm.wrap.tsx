import { get } from "lodash";
import React, { useEffect } from "react";
import { DocumentRevisionFormProps, DocumentRevisionFormState, SM, SMProvider } from "../../..";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions/types";
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
        _documentRevisionFormState?.setDocumentRevision(documentRevision);
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
