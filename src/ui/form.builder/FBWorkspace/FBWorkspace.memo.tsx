import { isEqual, size } from "lodash";
import React from "react";
import { FBSchema, FBStarter, FBWorkspaceBottomBar, FBWorkspaceProps } from "..";

const FBWorkspaceMemo: React.FunctionComponent<FBWorkspaceProps> = ({
  isStarter,
  schema,
  mode = "none",
  includeTransport = true,
}) => (
  <>
    {isStarter && <FBStarter />}
    {!isStarter && size(schema) > 0 && <FBSchema {...{ schema }} workspaceMode={mode} />}
    <FBWorkspaceBottomBar {...{ includeTransport }} />
  </>
);

export default React.memo(FBWorkspaceMemo,  (prev: FBWorkspaceProps, next: FBWorkspaceProps) =>
  prev.mode === next.mode && isEqual(prev.schema, next.schema));

