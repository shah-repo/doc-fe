import { Box } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { attachmentColorByType } from "./attachmentColorByType";
import { renderCOADefaultAttachment, renderCOAPrimaryAttachment, renderDefaultAttachment, renderPrimaryAttachment, renderRedLineAttachment } from "./attachmentIcons";
import { styles } from "./utils/styles";
import { AttachmentIconProps } from "./utils/types";

export const AttachmentIcon: React.FunctionComponent<AttachmentIconProps> = ({
  extension,
  size,
  isUploading,
  isRedLine,
  isPrimary,
  isTransferred,
}) => {
  const classes = styles({ size: size || "md", disabled: false });
  const name = extension?.toUpperCase();
  const color = attachmentColorByType[extension?.toUpperCase() as string];
  return (
    <Box
      data-cy={isPrimary ? "attachment.icon.primary" : isRedLine ? "attachment.icon.redline" : "attachment.icon"}
      className={classNames(classes.root,
        {
          [classes.isUploading]: isUploading,
        },
      )}
    >
      {isRedLine && renderRedLineAttachment(color, name)}
      {isTransferred && isPrimary && !isRedLine  && renderCOAPrimaryAttachment(color, name)}
      {isPrimary && !isTransferred && !isRedLine && renderPrimaryAttachment(color, name)}
      {isTransferred && !isPrimary && !isRedLine && renderCOADefaultAttachment(color, name)}
      {!isPrimary && !isRedLine && !isTransferred &&  renderDefaultAttachment(color, name)}
    </Box>
  );
};

export default AttachmentIcon;
