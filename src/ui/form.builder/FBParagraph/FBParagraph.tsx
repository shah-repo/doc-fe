import { Box } from "@material-ui/core";
import parse from "html-react-parser";
import React from "react";
import { FBParagraphProps } from "..";
import Colors from "../../layout/theme/utils/colors";

const FBParagraph: React.FunctionComponent<FBParagraphProps> = ({
  paragraph = "",
  gutter = true,
}) => (
  <Box  mb={gutter ? 4 : 1} fontSize={12} fontWeight= {400} lineHeight="20px" color={Colors.almost_black}>
    {parse(paragraph)}
  </Box>
);

export default FBParagraph;
