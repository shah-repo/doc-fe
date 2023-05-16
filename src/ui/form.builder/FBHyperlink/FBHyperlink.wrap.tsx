import React from 'react';
import { FBHyperlinkProps } from '..';

export const withFBHyperlink = <T extends FBHyperlinkProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    linkUrl = 'https://',
    onClick,
    ...props
  }: T) => {

    onClick = () =>
      window.open(linkUrl.includes('http') ? linkUrl : `https://${linkUrl}`);

    return Component({
      ...(props as T),
      linkUrl,
      onClick,
    });
  };

  return (props: T) => Comp(props);
};
