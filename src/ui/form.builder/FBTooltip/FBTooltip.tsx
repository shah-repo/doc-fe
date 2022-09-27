import { Box, Tooltip } from "@material-ui/core";
import { isString, isUndefined } from "lodash";
import React from "react";
import { FBConditionalWrapper, FBTooltipProps } from "..";
import Text from "../../components/Text";
import useStyles from "./FBTooltip.styles";

const FBTooltip: React.FC<FBTooltipProps> = ({
  arrow = true,
  placement = "top",
  title,
  children,
  ...props
}) => {
  const classes = useStyles();

  return (
    <FBConditionalWrapper
      condition={!isUndefined(title)}
      wrapper={(children) => (
        <Tooltip
          arrow={arrow}
          placement={placement}
          title={title}
          classes={classes}
          {...props}
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
};

export default FBTooltip;
