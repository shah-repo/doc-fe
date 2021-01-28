import { Box } from "@material-ui/core";
import React from "react";
import { FBIconConfig, FBIconProps, FBMapWrapper } from "..";
import { withFBIcon } from "./FBIcon.wrap";

const FBIcon: React.FunctionComponent<FBIconProps> = ({
  icon,
  boxProps,
  children,
}) => (
  <Box {...boxProps}>
    <svg width="100%" height="100%" viewBox="0 0 1024 1024">
      <FBMapWrapper<FBIconConfig[]> collection={icon as FBIconConfig[] || []}>
        {(config: FBIconConfig, index: number) => (
          <path key={`fb-icon-${index}`} d={config.path} fill={config.fill} />
        )}
      </FBMapWrapper>
    </svg>
    {children}
  </Box>
);

export default withFBIcon(FBIcon);
