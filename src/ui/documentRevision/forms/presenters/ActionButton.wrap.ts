import React, { useState } from 'react';

export const withActionButton = <T extends any>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    ...props
  }: T) => {

    const [cancelButtonDisplay, setCancelButtonDisplay] = useState(false);
    const [upgradeToLastestDisplay, setUpgradeToLastestDisplay] = useState(false);

    return Component({
      ...(props),
      cancelButtonDisplay,
      setCancelButtonDisplay,
      upgradeToLastestDisplay,
      setUpgradeToLastestDisplay,
    });
  };

  Comp.displayName = 'withActionButton';
  return Comp;
};
