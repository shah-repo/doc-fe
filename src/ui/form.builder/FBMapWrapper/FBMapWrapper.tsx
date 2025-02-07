import { Dictionary, map } from 'lodash';
import React from 'react';
import { FBMapWrapperProps } from '..';

const FBMapWrapper = <T extends any>({
  collection,
  children,
  ...props
}: FBMapWrapperProps<T>) => (
  <React.Fragment>
    {map(collection as Dictionary<T>, (value: T, key: number | any) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      (<React.Fragment key={key}>
        {children(value, key, props)}
      </React.Fragment>
      ))}
  </React.Fragment>
);

export default FBMapWrapper;
