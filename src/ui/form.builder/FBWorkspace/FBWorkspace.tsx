import { Portal } from "@material-ui/core";
import { isUndefined } from "lodash";
import React from "react";
import { FBWorkspaceMemo, FBWorkspaceProps } from ".";
import { FBConditionalWrapper, FBDialog, FBFieldName, FBForm, FBProvider, FBSnackbar } from "..";
import { FBProcedureDiff } from "../FBProcedureDiff";
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
    <FBForm {...{ initialValues }} workspaceMode={mode}>
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
            <FBWorkspaceMemo {...{ isStarter, schema, mode, includeTransport }} />
          </FBConditionalWrapper>
        </>
      )}
    </FBForm>
  </FBProvider>
);

export default withFBWorkspace(FBWorkspace);
