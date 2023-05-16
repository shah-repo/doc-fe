import React from 'react';
import { DocumentRevisionHeaderProps, SM } from '../../../../..';

export const withDocumentRevisionHeaderWrap = <T extends DocumentRevisionHeaderProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    ...props
  }: T) => {

    // MARK: @config
    const { _documentRevisionFormState } = SM.useStores();

    // MARK: @init

    // MARK: @state

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    return (
      <Component
        {...props}
        {...{ _documentRevisionFormState }}
      />
    );
  };

  Comp.displayName = 'withDocumentRevisionHeaderWrap';
  return (props: T) => Comp(props);
};
