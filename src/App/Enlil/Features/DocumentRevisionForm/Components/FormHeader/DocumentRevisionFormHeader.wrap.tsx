import { isUndefined } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { DocumentRevisionFormHeaderProps, SM } from "../../../../..";
import { authSelectors } from "../../../../../../state/ducks/auth";
import { isOperator } from "../../../../../../ui/documentRevision/DocumentRevisionDisplay.container";

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
    const isOwner = _documentRevisionFormState?.documentRevision?.owner
      ? _documentRevisionFormState?.documentRevision?.owner.user.email === email
      : true;
    isDisabledInput = (
      !isUndefined(_documentRevisionFormState?.documentRevision?.id) &&
      isCurrentUserOperator &&
      !isOwner
    );

    // MARK: @state

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    return (
      <Component
        {...props as T}
        {...{ _documentRevisionFormState, isDisabledInput }}
      />
    );
  };

  Comp.displayName = "withDocumentRevisionFormHeaderWrap";
  return Comp;
};
