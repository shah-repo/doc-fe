import { Portal } from "@material-ui/core";
import { isUndefined } from "lodash";
import React from "react";
import { FBConditionalWrapper, FBDialog, FBFieldName, FBForm, FBProcedureDiff, FBProvider, FBSnackbar, FBWorkspaceMemo, FBWorkspaceProps } from "..";
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
}) => (
  <FBProvider {...{ workspaceState, dialogState, snackbarState }}>
    <FBSnackbar autoHideDuration={6000}/>
    <FBDialog />
    <FBForm {...{ initialValues }} workspaceMode={mode} initialValidation={true}>
      {children}
      {active && (
        <>
          <FBConditionalWrapper
            condition={!isUndefined(portalContainer)}
            wrapper={(wrapperChildren) => (
              <Portal container={portalContainer?.current}>
                {wrapperChildren}
              </Portal>
            )}
          >
            {includeProcedureDiff && (
              <FBProcedureDiff name={FBFieldName.ProcedureDiff} />
            )}
            <FBWorkspaceMemo {...{ isStarter, schema, mode, includeTransport, workspaceState }} />
          </FBConditionalWrapper>
        </>
      )}
    </FBForm>
  </FBProvider>
);

export default withFBWorkspace(FBWorkspace);
