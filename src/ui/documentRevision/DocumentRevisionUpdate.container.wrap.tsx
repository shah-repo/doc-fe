import React, { useState } from 'react';
import { FBFormStateContext } from '../app/Layout';
import { FBFormState } from '../form.builder';
import { DocumentRevisionUpdateContainerProps } from './DocumentRevisionUpdate.container';

export const withDocumentRevisionUpdateContainerWrap = <T extends DocumentRevisionUpdateContainerProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    ...props
  }: T) => {
    const [values, setValues] = useState<FBFormState['values']>({});

    return (
      <FBFormStateContext.Provider value={{ values, setValues }} >
        <Component
          {...props}
        />
      </FBFormStateContext.Provider>
    );
  };

  Comp.displayName = 'withDocumentRevisionUpdateContainerWrap';
  return (props: T) => Comp(props);
};
