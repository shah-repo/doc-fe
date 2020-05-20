import { Box, Tooltip } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { FBConditionalWrapper } from "..";
import Text from "../../components/Text";
import { FBTooltipProps } from "./FBTooltip.types";

const FBTooltip: React.FunctionComponent<FBTooltipProps> = ({
  title,
  children,
  ...props
}) => (
  <FBConditionalWrapper
    condition={!_.isUndefined(title)}
    wrapper={(children) => (
      <Tooltip
        {...props}
        title={title}
        {..._.isString(title) && { title: <Text message={title} /> }}
      >
        <Box component="span">
          {children}
        </Box>
      </Tooltip>
    )}
  >
    <React.Fragment>
      {children}
    </React.Fragment>
  </FBConditionalWrapper>


);

export default FBTooltip;
