import { Portal } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { FBWorkspaceMemo, FBWorkspaceProps } from ".";
import { FBConditionalWrapper, FBDialog, FBForm, FBProvider } from "..";
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
  initialValues,
  includeTransport,
}) => (
  <FBProvider {...{ workspaceState, dialogState }}>
    <FBDialog />
    <FBForm {...{ initialValues }} workspaceMode={mode}>
      {children}
      {active && (
        <>
          <FBConditionalWrapper
            condition={!_.isUndefined(portalContainer)}
            wrapper={(wrapperChildren) => (
              <Portal container={portalContainer?.current}>
                {wrapperChildren}
              </Portal>
            )}
          >
            <FBWorkspaceMemo {...{ isStarter, schema, mode, includeTransport }} />
          </FBConditionalWrapper>
        </>
      )}
    </FBForm>
  </FBProvider>
);

export default withFBWorkspace(FBWorkspace);
