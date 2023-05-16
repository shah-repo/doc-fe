import { useObserver } from 'mobx-react';
import React from 'react';
import { BlockTypeField } from '..';
import { FBFieldOutputWrapperProps } from './FBFieldOutputWrapper.types';

export const withFBFieldOutputWrapper = <T extends FBFieldOutputWrapperProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    inputProps,
    position,
    ...props
  }: T) => {
    const { type } = inputProps || {};

    const isSection = type === 'section' || type === 'subsection';
    const isBlock = type && BlockTypeField.includes(type);
    const isFirst = position === 1;
    const mt = isFirst ? 0 : isBlock ? 6 : 3.5;
    const mb = isSection ? -0.5 : 2;

    return useObserver(() => Component({
      ...(props as T),
      mt,
      mb,
    }));
  };

  return (props: T) => Comp(props);
};
