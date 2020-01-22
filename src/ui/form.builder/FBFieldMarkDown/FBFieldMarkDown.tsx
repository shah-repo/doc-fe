import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { FBFieldMarkDownProps } from ".";
import { withFBFieldMarkDown } from "./FBFieldMarkDown.wrap";

const FBFormMarkDown: React.FunctionComponent<FBFieldMarkDownProps> = ({
  source = "",
}) => {
  return (
    <SyntaxHighlighter language="javascript" style={docco}>
      {source}
    </SyntaxHighlighter>
  );
};

export default withFBFieldMarkDown(FBFormMarkDown);
