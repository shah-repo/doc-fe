import { Box } from "@material-ui/core";
import React from "react";
import { FBSectionProps } from ".";
import { FBInput, FBText } from "..";
import Colors from "../../layout/theme/utils/colors";

const FBSection: React.FunctionComponent<FBSectionProps> = ({
  label,
  gutter = true,
  bookmarked = true,
  stepIndex,
  children,
  loading,
  index,
  name,
}) => (
  <FBInput {...{ gutter, bookmarked, name, label, index }} type="section">
    <Box
      bgcolor={Colors.medium_blue}
      color="primary.contrastText"
      py={1.5}
      px={2}
      fontSize="body1.fontSize"
      fontWeight="fontWeightBold"
      borderRadius={4}
      id={name}
      style={{ scrollMarginTop: 50 }}
    >
      {label && (
        <FBText
          locale={label as string}
          boxProps={{
            component: "span",
            style: { textTransform: "uppercase" },
          }}
          {...{ loading }}
        />
      )}
      {stepIndex && ` #${stepIndex}`}
      {children}
    </Box>
  </FBInput>
);

export default FBSection;
