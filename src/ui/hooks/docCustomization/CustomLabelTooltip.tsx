import { Box, Tooltip, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import Text from "../../components/Text";
import ConditionalWrapper from "./ConditionalWrapper";
import { CustomLabelTooltipProps } from "./types";

const CustomLabelTooltip: React.FunctionComponent<CustomLabelTooltipProps> = ({
  tooltipConfig,
  children,
  ...props
}) => {
  const isCustomLabelsOn = useSelector(authSelectors.isCustomLabelsOn);

  return (
    <ConditionalWrapper
      condition={isCustomLabelsOn}
      wrapper={(children) => (
        <Tooltip
          {...props}
          title={
            <React.Fragment>
              <Typography color="inherit">
                <Text translation="tooltip.label.name" values={{ labelName: tooltipConfig?.labelName }}/>
              </Typography>
              <Typography color="inherit">
                <Text translation="tooltip.default.label" values={{ defaultLabel: tooltipConfig?.defaultLabel }}/>
              </Typography>
              <Typography color="inherit">
                <Text
                  translation="tooltip.overridden.label"
                  values={{ overriddenLabel: tooltipConfig?.overriddenLabel }}
                />
              </Typography>
              <Typography color="inherit">
                <Text translation="tooltip.required.flag" values={{ requiredFlag: tooltipConfig?.requiredFlag }}/>
              </Typography>
              <Typography color="inherit">
                <Text translation="tooltip.visibility.flag" values={{ visibilityFlag: tooltipConfig?.visibilityFlag }}/>
              </Typography>
            </React.Fragment>
          }
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
    </ConditionalWrapper>
  );
};

export default CustomLabelTooltip;
