import { Tooltip } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import Text from "../../components/Text";
import { FBTooltipProps } from "./FBTooltip.types";

const FBTooltip: React.FunctionComponent<FBTooltipProps> = ({
  ...props
}) => (
  <Tooltip
    {...props}
    {..._.isString(props.title) && { title: <Text message={props.title} /> }}
    {...!_.isString(props.title) && { title: props.title }}
  />
);

export default FBTooltip;
