import { Portal } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { FBWorkspaceProps } from ".";
import { FBConditionalWrapper, FBDialog, FBForm, FBProvider, FBSchema, FBStarter } from "..";
import { withFBWorkspace } from "./FBWorkspace.wrap";

const FBWorkspace: React.FunctionComponent<FBWorkspaceProps> = ({
  isStarter,
  active,
  workspaceState,
  children,
  portalContainer,
  dialogState,
  schema,
  mode = "none",
  initialValues = {},
}) => (
  <FBProvider {...{ workspaceState, dialogState }}>
    <FBForm {...{ initialValues }} workspaceMode={mode}>
      {children}
      {active && (
        <>
          <FBDialog />
          <FBConditionalWrapper
            condition={!_.isUndefined(portalContainer)}
            wrapper={(wrapperChildren) => (
              <Portal container={portalContainer?.current}>
                {wrapperChildren}
              </Portal>
            )}
          >
            {isStarter && <FBStarter />}
            {!isStarter && <FBSchema {...{ schema }} workspaceMode={mode} />}
          </FBConditionalWrapper>
        </>
      )}
    </FBForm>
  </FBProvider>
);

export default withFBWorkspace(FBWorkspace);
