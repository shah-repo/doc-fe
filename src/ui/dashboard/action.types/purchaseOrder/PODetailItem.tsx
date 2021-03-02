import { Box } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { Translation } from "../../../translations/types";

interface Props {
  label: Translation;
  value: string | number;
}

const PODetailItem: React.FunctionComponent<Props> = ({
  label,
  value,
}) => (
  <Box marginBottom="5px">
    <Box component="span" fontWeight="fontWeightBold">
      <Text translation={label} />
      {": "}
    </Box>
    <Box component="span">{value}</Box>
  </Box>
);

export default PODetailItem;
