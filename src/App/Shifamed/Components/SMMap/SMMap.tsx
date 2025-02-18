import { Dictionary, map } from 'lodash';
import React from 'react';
import { SMMapProps } from '../../..';

const SMMap = <T extends any>({
  collection,
  children,
  ...props
}: SMMapProps<T>) => (
  <React.Fragment>
    {map(collection as Dictionary<T>, (value: T, key: number | any) => children(value, key, props))}
  </React.Fragment>
);

export default SMMap;
