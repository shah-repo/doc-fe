import React, { useState } from 'react';
import { FBFormStateContext } from '../app/Layout';
import { FBFormState } from '../form.builder';
import { ChangeRequestUpdateContainerProps } from './ChangeRequestUpdate.container';

export const withChangeRequestContainerWrap = <T extends Partial<ChangeRequestUpdateContainerProps>>(
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

  Comp.displayName = 'withChangeRequestContainerWrap';
  return (props: T) => Comp(props);
};
