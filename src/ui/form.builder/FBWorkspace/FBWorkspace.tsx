import { Portal } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { FBWorkspaceProps } from ".";
import { FBConditionalWrapper, FBDialog, FBForm, FBProvider, FBSchema, FBStarter, FBWorkspaceBottomBar } from "..";
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
  includeTransport = true,
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
            {isStarter && <FBStarter />}
            {!isStarter && <FBSchema {...{ schema }} workspaceMode={mode} />}
            <FBWorkspaceBottomBar {...{ includeTransport }} />
            {/* <Box display="flex">
              {mode === "design" && (
                <FBButton
                  label="Form Preview"
                  onClick={handleFormPreview}
                  id="FBWorkspace-clickView"
                />
              )}
              {includeTransport && <FBTransportSchema />}
            </Box> */}
          </FBConditionalWrapper>
        </>
      )}
    </FBForm>
  </FBProvider>
);

export default withFBWorkspace(FBWorkspace);
