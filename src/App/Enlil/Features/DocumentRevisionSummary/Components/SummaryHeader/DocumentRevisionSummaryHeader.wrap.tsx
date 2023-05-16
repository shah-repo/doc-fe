import React from 'react';
import { DocumentRevisionSummaryHeaderProps, SM } from '../../../../..';
import { useCRLink, useTitle } from '../../../../../../ui/hooks/docCustomization/useCustomization';
import useDescription from '../../../../../../ui/hooks/docCustomization/useDescription';

export const withDocumentRevisionSummaryHeader = <T extends DocumentRevisionSummaryHeaderProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    documentRevision,
    ...props
  }: T) => {

    // MARK: @config
    const { _documentRevisionFormState } = SM.useStores();
    const { document, name, description } = documentRevision || {};
    const docTypeId = document?.documentType?.id;

    const { isVisible: isDescriptionVisible, label: descriptionLabel } = useDescription(docTypeId);
    const { isVisible: isTitleVisible, label: titleLabel, tooltipConfig } = useTitle(docTypeId);
    const { isVisible: isCRLinkVisible } = useCRLink(docTypeId);

    // MARK: @state

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    return (
      <Component
        {...props as T}
        {...{
          _documentRevisionFormState,
          documentRevision,
          isCRLinkVisible,
          isTitleVisible,
          isDescriptionVisible,
          tooltipConfig,
          titleLabel,
          name,
          descriptionLabel,
          description,
        }}
      />
    );
  };

  Comp.displayName = 'withDocumentRevisionSummaryHeader';
  return Comp;
};
