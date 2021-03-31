import { Portal } from "@material-ui/core";
import React from "react";
import { FBDialog, FBFieldName, FBForm, FBProcedureDiff, FBProvider, FBSnackbar, FBWorkspaceMemo, FBWorkspaceProps } from "..";
import { withFBWorkspace } from "./FBWorkspace.wrap";

const FBWorkspace: React.FunctionComponent<FBWorkspaceProps> = ({
  isStarter,
  active,
  workspaceState,
  children,
  portalContainer,
  dialogState,
  snackbarState,
  schema,
  mode = "none",
  initialValues,
  includeTransport,
  includeProcedureDiff,
  isPortal,
}) => (
  <FBProvider {...{ workspaceState, dialogState, snackbarState }}>
    <FBSnackbar autoHideDuration={6000}/>
    <FBDialog />
    <FBForm {...{ initialValues }} workspaceMode={mode} initialValidation={true}>
      {children}
      {active && (
        <>
          {isPortal && portalContainer?.current && (
            <Portal container={portalContainer?.current}>
              {includeProcedureDiff && (
                <FBProcedureDiff name={FBFieldName.ProcedureDiff} />
              )}
              <FBWorkspaceMemo {...{ isStarter, schema, mode, includeTransport, workspaceState }} />
            </Portal>
          )}
          {!isPortal && (
            <>
              {includeProcedureDiff && (
                <FBProcedureDiff name={FBFieldName.ProcedureDiff} />
              )}
              <FBWorkspaceMemo {...{ isStarter, schema, mode, includeTransport, workspaceState }} />
            </>
          )}
        </>
      )}
    </FBForm>
  </FBProvider>
);

export default withFBWorkspace(FBWorkspace);
