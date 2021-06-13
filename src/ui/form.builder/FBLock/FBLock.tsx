import React from "react";
import { FBLockProps } from "..";
import { withFBLock } from "./FBLock.wrap";

const FBLocked: React.FunctionComponent<FBLockProps> = ({
  children,
}) => (
  <>
    {children}
  </>
);

export default withFBLock(FBLocked);
