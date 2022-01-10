import React from "react";
import { DocumentRevisionFormHOCProps, DocumentRevisionFormState, SM, SMProvider } from "../../..";

export const withDocumentRevisionForm = <T extends DocumentRevisionFormHOCProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    _documentRevisionFormState,
    ...props
  }: T) => {

    _documentRevisionFormState = SM.useRef(DocumentRevisionFormState);

    return (
      <SMProvider {...{ _documentRevisionFormState }}>
        <Component {...props as T} {...{ _documentRevisionFormState }} />
      </SMProvider>
    );
  };

  Comp.displayName = "withDocumentRevisionForm";
  return Comp;
};

