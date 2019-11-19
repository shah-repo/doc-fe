import { Box } from "@material-ui/core";
import React from "react";
import Text from "../Text";

interface OwnProps {
    numberOfRecords: number;
}

export type Props = OwnProps;

export const DocumentInfo: React.FunctionComponent<Props> = ({
  numberOfRecords,
}) => {
  return (
    <Box component="span">
        <Text translation="common.records.found"/>
        :&nbsp;
        <span style={{fontWeight: "bold"}}>{numberOfRecords}</span>
    </Box>
  );
};

export default DocumentInfo;
