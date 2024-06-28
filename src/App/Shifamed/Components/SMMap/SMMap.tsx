import { map } from 'lodash';
import React from 'react';
import { SMMapProps } from '../../..';

const SMMap = <T extends any>({
  collection,
  children,
  ...props
}: SMMapProps<T>) => (
  <React.Fragment>
    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
    {/* @ts-ignore */}
    {map(collection, (value: T, key: number | any) => children(value, key, props))}
  </React.Fragment>
);

export default SMMap;
