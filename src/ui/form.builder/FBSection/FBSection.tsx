import { Box } from "@material-ui/core";
import { startCase, toLower } from "lodash";
import React from "react";
import { FBInput, FBSectionProps, FBText } from "..";
import Colors from "../../layout/theme/utils/colors";
import { isTranslation } from "../../translations/types";

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
}) => {

  const getTitleCaseLabel = (label) => {
    if (label.split(".").length === 1 && !isTranslation(label)) {
      return startCase(toLower(label));
    }
    return label;
  };

  return (
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
            locale={getTitleCaseLabel(label) as string}
            boxProps={{
              component: "span",
              style: { float: "left" },
            }}
            {...{ loading }}
          />
        )}
        {stepIndex && (<span>&nbsp;#{stepIndex}</span>)}
        {children}
      </Box>
    </FBInput>
  );
};
export default FBSection;
