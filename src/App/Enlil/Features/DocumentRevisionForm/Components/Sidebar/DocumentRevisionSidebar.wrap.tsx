import React from "react";
import { DocumentRevisionSidebarProps, DocumentRevisionSidebarState, SM, SMProvider } from "../../../../..";

export const withDocumentRevisionSidebarWrap = <T extends DocumentRevisionSidebarProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    _documentRevisionSidebarState,
    ...props
  }: T) => {

    // MARK: @config
    _documentRevisionSidebarState = SM.useRef(DocumentRevisionSidebarState);

    // MARK: @state

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    return (
      <SMProvider {...{ _documentRevisionSidebarState }}>
        <Component
          {...props as T}
          {...{ _documentRevisionSidebarState }}
        />
      </SMProvider>
    );
  };

  Comp.displayName = "withDocumentRevisionSidebarWrap";
  return Comp;
};
