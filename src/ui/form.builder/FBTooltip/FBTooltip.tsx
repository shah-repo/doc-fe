import { Box, Tooltip } from "@material-ui/core";
import { isString, isUndefined } from "lodash";
import React from "react";
import { FBConditionalWrapper, FBTooltipProps } from "..";
import Text from "../../components/Text";

const FBTooltip: React.FunctionComponent<FBTooltipProps> = ({
  title,
  children,
  ...props
}) => (
  <FBConditionalWrapper
    condition={!isUndefined(title)}
    wrapper={(children) => (
      <Tooltip
        {...props}
        title={title}
        {...isString(title) && { title: <Text message={title} /> }}
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
