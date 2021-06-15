import React from "react";
import { FBLockProps } from "..";
import { SMProvider } from "../../../App";
import { withFBLock } from "./FBLock.wrap";

const FBLocked: React.FunctionComponent<FBLockProps> = ({
  children,
}) => (
  <SMProvider>
    {children}
  </SMProvider>
);

export default withFBLock(FBLocked);
