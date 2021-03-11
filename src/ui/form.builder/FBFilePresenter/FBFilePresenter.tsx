import React from "react";
import { FBDialog, FBFilePresenterIcon, FBFilePresenterProps, FBFilePresenterRaw, FBProvider } from "..";
import { withFBFilePresenter } from "./FBFilePresenter.wrap";

const FBFilePresenter: React.FunctionComponent<FBFilePresenterProps> = ({
  filePresenterState,
  dialogState,
  mode = "icon",
  disabled,
  ...props
}) =>  (
  <FBProvider {...{ dialogState, filePresenterState }}>
    <FBDialog />
    {mode === "icon" && <FBFilePresenterIcon {...props} {...{ filePresenterState, disabled }} />}
    {mode === "raw" && <FBFilePresenterRaw {...props} {...{ filePresenterState }} />}
  </FBProvider>
);

export default withFBFilePresenter(FBFilePresenter);
