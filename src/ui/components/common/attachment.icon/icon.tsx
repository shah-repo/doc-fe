import { Box } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { attachmentColorByType } from "./attachmentColorByType";
import { renderDefaultAttachment, renderPrimaryAttachment, renderRedLineAttachment } from "./attachmentIcons";
import { styles } from "./utils/styles";
import { AttachmentIconProps } from "./utils/types";

export const AttachmentIcon: React.FunctionComponent<AttachmentIconProps> = ({
  extension,
  size,
  isUploading,
  isRedLine,
  isPrimary,
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
      {isPrimary && renderPrimaryAttachment(color, name)}
      {!isPrimary && !isRedLine && renderDefaultAttachment(color, name)}
    </Box>
  );
};

export default AttachmentIcon;
