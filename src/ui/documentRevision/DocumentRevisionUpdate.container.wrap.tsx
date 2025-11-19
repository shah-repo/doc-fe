import React, { Dispatch, SetStateAction, useState } from 'react';
import { FBFormState } from '../form.builder';
import { DocumentRevisionUpdateContainerProps } from './DocumentRevisionUpdate.container';

interface FBFormStateContextProps {
  values: FBFormState['values']
  setValues: Dispatch<SetStateAction<FBFormState['values']>>
}

export const FBFormStateContext = React.createContext<FBFormStateContextProps>({} as FBFormStateContextProps);

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
