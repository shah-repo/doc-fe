import { isEmpty, isUndefined } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { DocumentRevisionFormHeaderProps, SM } from '../../../../..';
import { translate } from '../../../../../../common/intl';
import { authSelectors } from '../../../../../../state/ducks/auth';
import { isOperator } from '../../../../../../ui/documentRevision/DocumentRevisionDisplay.container';
import { checkIsDocumentSupplier } from '../../../../../../ui/documentRevision/helpers/checkDocumentGroup';

export const withDocumentRevisionFormHeader = <T extends DocumentRevisionFormHeaderProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    isDisabledInput,
    ...props
  }: T) => {
    // MARK: @config
    const { _documentRevisionFormState } = SM.useStores();

    const isCurrentUserOperator = React.useContext(isOperator);
    const email = useSelector(authSelectors.currentUserEmail);
    let isOwner = _documentRevisionFormState?.documentRevision?.owner
      ? _documentRevisionFormState?.documentRevision?.owner.user.email === email
      : true;

    if (isCurrentUserOperator && isEmpty(_documentRevisionFormState?.documentRevision?.owner)) {
      isOwner = false;
    }

    isDisabledInput = (
      !isUndefined(_documentRevisionFormState?.documentRevision?.id)
      && isCurrentUserOperator
      && !isOwner && !_documentRevisionFormState?.documentRevision?.isBeingEditedAfterRelease);

    const groupOptions = _documentRevisionFormState?.documentRevision?.document?.documentType?.groupOptions;
    const isSupplier = checkIsDocumentSupplier(groupOptions);
    const descriptionPlaceholder = translate(isSupplier ? 'form.builder.supplier.enter.description' : 'form.builder.enter.description');
    const titlePlaceholder = translate(isSupplier ? 'form.builder.supplier.enter.title' : 'form.builder.enter.title');

    // MARK: @state

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    return (
      <Component
        {...props as T}
        {...{ _documentRevisionFormState, isDisabledInput, descriptionPlaceholder, titlePlaceholder }}
      />
    );
  };

  Comp.displayName = 'withDocumentRevisionFormHeaderWrap';
  return Comp;
};
