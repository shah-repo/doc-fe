import { isEqual, size } from "lodash";
import React from "react";
import { FBSchema, FBStarter, FBWorkspaceBottomBar, FBWorkspaceProps, FBWorkspaceSocket } from "..";

const FBWorkspaceMemo: React.FunctionComponent<FBWorkspaceProps> = ({
  isStarter,
  schema,
  mode = "none",
  includeTransport = true,
  workspaceState,
}) => (
  <>
    <FBWorkspaceSocket />
    {isStarter && <FBStarter />}
    {!isStarter && size(schema) > 0 && <FBSchema {...{ schema }} schemaState={workspaceState} workspaceMode={mode} />}
    <FBWorkspaceBottomBar {...{ includeTransport }} />
  </>
);

export default React.memo(FBWorkspaceMemo,  (prev: FBWorkspaceProps, next: FBWorkspaceProps) =>
  prev.mode === next.mode && isEqual(prev.schema, next.schema));

