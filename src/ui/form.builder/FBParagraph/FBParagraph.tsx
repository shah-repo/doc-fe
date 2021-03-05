import { Box } from "@material-ui/core";
import parse from "html-react-parser";
import React from "react";
import { FBParagraphProps } from "..";

const FBParagraph: React.FunctionComponent<FBParagraphProps> = ({
  paragraph = "",
  gutter = true,
}) => (
  <Box  mb={gutter ? 4 : 1}>
    {parse(paragraph)}
  </Box>
);

export default FBParagraph;
