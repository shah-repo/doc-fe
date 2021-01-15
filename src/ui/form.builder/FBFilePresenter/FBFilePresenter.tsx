import React from "react";
import { FBDialog, FBFilePresenterIcon, FBFilePresenterProps, FBFilePresenterRaw, FBProvider } from "..";
import { withFBFilePresenter } from "./FBFilePresenter.wrap";

const FBFilePresenter: React.FunctionComponent<FBFilePresenterProps> = ({
  dialogState,
  mode = "icon",
  ...props
}) =>  (
  <FBProvider {...{ dialogState }}>
    <FBDialog />
    {mode === "icon" && <FBFilePresenterIcon {...props}/>}
    {mode === "raw" && <FBFilePresenterRaw {...props} />}
  </FBProvider>
);

export default withFBFilePresenter(FBFilePresenter);
