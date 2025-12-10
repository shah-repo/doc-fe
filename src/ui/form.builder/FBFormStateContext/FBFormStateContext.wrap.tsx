import React, { useState } from 'react';
import FBFormState from '../FBForm/FBForm.state';
import { FBFormStateContextProps } from './FBFormStateContext.types';

export const FBFormStateContext = React.createContext<FBFormStateContextProps>({} as FBFormStateContextProps);

export const withFBFormStateContextWrap = <T extends Record<string, any>>(
  Component: React.FunctionComponent<T>,
): React.ReactNode => {
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

  Comp.displayName = 'withFBFormStateContextWrap';
  return (props: T) => Comp(props);
};
