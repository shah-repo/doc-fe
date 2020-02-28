import _ from "lodash";
import React from "react";
import { FBMapWrapperProps } from "./FBMapWrapper.types";

const FBMapWrapper = <T extends any>({
  collection,
  children,
  ...props
}: FBMapWrapperProps<T>) => (
  <React.Fragment>
    {_.map(collection, (item: T, index) => children({ ...item }, index, props))}
  </React.Fragment>
);

export default FBMapWrapper;
