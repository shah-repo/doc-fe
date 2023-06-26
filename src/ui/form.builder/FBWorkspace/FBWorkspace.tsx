import { Portal } from '@material-ui/core';
import { Observer } from 'mobx-react';
import React from 'react';
import { FBDialog, FBForm, FBLock, FBProvider, FBSnackbar, FBWorkspaceMemo, FBWorkspaceModeOptions, FBWorkspaceProps } from '..';
import { withFBWorkspace } from './FBWorkspace.wrap';

const FBWorkspace: React.FunctionComponent<FBWorkspaceProps> = ({
  workspaceState,
  children,
  portalContainer,
  dialogState,
  snackbarState,
  schema,
  mode,
  initialValues,
  includeTransport,
  isPortal,
  _tabsState,
  isStarterRequired,
  withoutBottomBar = false,
}) => (
  <FBProvider {...{ workspaceState, dialogState, snackbarState }}>
    <FBSnackbar autoHideDuration={6000} />
    <FBDialog />
    {/* The workspaceMode of the form should be what is passed in Or
    by default be the mode in which the workspace is, instead of being 'none' */}
    <FBForm {...{ initialValues }}
      workspaceMode={mode || workspaceState?.mode || FBWorkspaceModeOptions.NONE}
      initialValidation={true} includeLocking={true}>
      <FBLock>
        {children}
        <Observer>
          {() => (
            <>
              {workspaceState?.active && (
                <>
                  {isPortal && portalContainer?.current && (
                    <Portal container={portalContainer?.current}>
                      <FBWorkspaceMemo
                        {...{ includeTransport, workspaceState, _tabsState }}
                        isStarter={isStarterRequired?.()}
                        mode={workspaceState?.mode}
                        schema={workspaceState?.schema}
                        withoutBottomBar={withoutBottomBar}
                      />
                    </Portal>
                  )}
                  {!isPortal && (
                    <FBWorkspaceMemo
                      {...{ schema, includeTransport, workspaceState, _tabsState }}
                      isStarter={isStarterRequired?.()}
                      mode={workspaceState?.mode}
                      schema={workspaceState?.schema}
                      withoutBottomBar={withoutBottomBar}
                    />
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
