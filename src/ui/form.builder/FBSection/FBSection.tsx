import { Box } from "@material-ui/core";
import React from "react";
import { FBSectionProps } from ".";
import { FBInput, FBText } from "..";
import Colors from "../../layout/theme/utils/colors";

const FBSection: React.FunctionComponent<FBSectionProps> = ({
  label,
  gutter = true,
  bookmarked = true,
  showErrorMsg = false,
  omitFinalValidation = true,
  stepIndex,
  children,
  loading,
  name,
  ...props
}) => (
  <FBInput
    {...{ gutter, bookmarked, name, label, showErrorMsg, omitFinalValidation }}
    {...props}
    type="section"
  >
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
      display="flex"
      flexDirection="row"
    >
      {label && (
        <FBText
          locale={label as string}
          boxProps={{
            component: "span",
            style: { textTransform: "uppercase", float: "left" },
          }}
          {...{ loading }}
        />
      )}
      {stepIndex && (<span>&nbsp;#{stepIndex}</span>)}
      {children}
    </Box>
  </FBInput>
);

export default FBSection;
