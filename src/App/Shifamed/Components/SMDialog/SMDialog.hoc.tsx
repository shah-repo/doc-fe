import React from 'react';
import { SMDialogContextProps, SMDialogHOCProps, SMDialogState } from '../../..';

export const SMDialogContext = React.createContext<SMDialogContextProps | undefined>(undefined);

export const withSMDialog = <T extends SMDialogHOCProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    dialogState,
    ...props
  }: T) => {

    dialogState = new SMDialogState();

    return (
      <SMDialogContext.Provider value={{ dialogState }}>
        <Component {...props as T} {...{ dialogState }} />
      </SMDialogContext.Provider>
    );
  };

  Comp.displayName = 'withSMDialog';
  return Comp;
};

