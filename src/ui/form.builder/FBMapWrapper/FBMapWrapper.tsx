import { map } from "lodash";
import React from "react";
import { FBMapWrapperProps } from "./FBMapWrapper.types";

const FBMapWrapper = <T extends any>({
  collection,
  children,
  ...props
}: FBMapWrapperProps<T>) => (
  <React.Fragment>
    {map(collection, (value: T, key: number | any) => children(value, key, props))}
  </React.Fragment>
);

export default FBMapWrapper;
