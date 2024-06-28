import { map } from 'lodash';
import React from 'react';
import { FBMapWrapperProps } from '..';

const FBMapWrapper = <T extends any>({
  collection,
  children,
  ...props
}: FBMapWrapperProps<T>) => (
  <React.Fragment>
    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
    {/* @ts-ignore */}
    {map(collection, (value: T, key: number | any) => children(value, key, props))}
  </React.Fragment>
);

export default FBMapWrapper;
