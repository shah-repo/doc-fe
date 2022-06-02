import { Portal } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { FBDialog, FBFieldName, FBForm, FBLock, FBProcedureDiff, FBProvider, FBSnackbar, FBWorkspaceMemo, FBWorkspaceProps } from "..";
import { withFBWorkspace } from "./FBWorkspace.wrap";

const FBWorkspace: React.FunctionComponent<FBWorkspaceProps> = ({
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
  _tabsState,
}) => (
  <FBProvider {...{ workspaceState, dialogState, snackbarState }}>
    <FBSnackbar autoHideDuration={6000}/>
    <FBDialog />
    <FBForm {...{ initialValues }} workspaceMode={mode} initialValidation={true} includeLocking={true}>
      <FBLock>
        {children}
        <Observer>
          {() => (
            <>
              {workspaceState?.active && (
                <>
                  {isPortal && portalContainer?.current && (
                    <Portal container={portalContainer?.current}>
                      {includeProcedureDiff && (
                        <FBProcedureDiff name={FBFieldName.ProcedureDiff} />
                      )}
                      <FBWorkspaceMemo
                        {...{ includeTransport, workspaceState }}
                        isStarter={workspaceState?.isStarter}
                        mode={workspaceState?.mode}
                        schema={workspaceState?.schema}
                      />
                    </Portal>
                  )}
                  {!isPortal && (
                    <>
                      {includeProcedureDiff && (
                        <FBProcedureDiff name={FBFieldName.ProcedureDiff} />
                      )}
                      <FBWorkspaceMemo
                        {...{ schema, includeTransport, workspaceState }}
                        isStarter={workspaceState?.isStarter}
                        mode={workspaceState?.mode}
                        schema={workspaceState?.schema}
                      />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Observer>
      </FBLock>
    </FBForm>
  </FBProvider>
);

export default withFBWorkspace(FBWorkspace);
