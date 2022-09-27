import { Box } from "@material-ui/core";
import React from "react";
import { FBInput, FBSectionProps, FBText } from "..";
import Colors from "../../layout/theme/utils/colors";

const FBSection: React.FunctionComponent<FBSectionProps> = ({
  label,
  gutter = true,
  bookmarked = true,
  showErrorMsg = false,
  omitFinalValidation = true,
  stepIndex,
  index = 0,
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
      color={Colors.almost_black}
      fontSize={16}
      lineHeight={1.5}
      fontWeight={600}
      id={name}
      style={{ scrollMarginTop: 50, borderBottom: `1px solid ${Colors.chinese_silver}` }}
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
