import { Box } from "@material-ui/core";
import React from "react";
import { FBSectionProps } from ".";
import { FBInput } from "..";
import Text from "../../components/Text";
import Colors from "../../layout/theme/utils/colors";

const FBSection: React.FunctionComponent<FBSectionProps> = ({
  label,
  gutter = true,
  bookmarked = true,
  stepIndex,
  children,
  index,
  name,
}) => (
  <FBInput {...{ gutter, bookmarked, name, label, index }} type="section">
    <Box
      bgcolor={Colors.medium_blue}
      color="primary.contrastText"
      py={1.5}
      px={2}
      fontSize="h6.fontSize"
      fontWeight={100}
      borderRadius={4}
      id={name}
      style={{ scrollMarginTop: 50 }}
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
    </Box>
  </FBInput>
);

export default FBSection;
