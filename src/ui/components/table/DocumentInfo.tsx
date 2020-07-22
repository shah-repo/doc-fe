import { Box } from "@material-ui/core";
import React from "react";
import Text from "../Text";

interface OwnProps {
  numberOfRecords: number;
}

export type Props = OwnProps;

export const DocumentInfo: React.FunctionComponent<Props> = ({
  numberOfRecords,
}) => (
  <Box component="span">
    <Text translation="common.records.found"/>
        :&nbsp;
    <span
      data-testid="numberOfRecords"
      style={{ fontWeight: "bold" }}
      data-cy="numberOfDocuments"
    >
      {numberOfRecords}
    </span>
  </Box>
);

export default DocumentInfo;
