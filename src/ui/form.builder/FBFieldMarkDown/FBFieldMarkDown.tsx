import { Box } from "@material-ui/core";
import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { FBFieldMarkDownProps } from ".";
import { withFBFieldMarkDown } from "./FBFieldMarkDown.wrap";

const FBFormMarkDown: React.FunctionComponent<FBFieldMarkDownProps> = ({
  source = "",
  mt,
}) => (
  <Box {...{ mt }}>
    <SyntaxHighlighter language="javascript" style={docco}>
      {source}
    </SyntaxHighlighter>
  </Box>
);

export default withFBFieldMarkDown(FBFormMarkDown);
