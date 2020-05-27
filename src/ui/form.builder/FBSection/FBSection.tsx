import { Box } from "@material-ui/core";
import React from "react";
import { FBSectionProps } from ".";
import Text from "../../components/Text";
import Colors from "../../layout/theme/utils/colors";

const FBSection: React.FunctionComponent<FBSectionProps> = ({
  label,
  gutter = true,
  stepIndex,
  children,
}) => (
  <Box
    bgcolor={Colors.medium_blue}
    color="primary.contrastText"
    py={1.5}
    px={2}
    fontSize="h6.fontSize"
    fontWeight={100}
    mb={gutter ? 4 : 0}
    borderRadius={4}
    id={label?.toString().replace(/\s/g, "")}
  >
    {label && (
      <Box component="span" style={{ textTransform: "uppercase" }}>
        <Text message={(label as string)}>
          {(txt: string) => txt}
        </Text>
      </Box>
    )}
    {stepIndex && ` #${stepIndex}`}
    {children}
  </Box> );

export default FBSection;
