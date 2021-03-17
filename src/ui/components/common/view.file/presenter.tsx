import Dialog from "@material-ui/core/Dialog";
import React, { useMemo } from "react";
import { Attachment } from "../../../../state/ducks/attachments/types";
import ViewFileContent from "./components/dialog.content";
import ViewFileTitle from "./components/dialog.title";
import { PDF, SUPPORTED_IMAGE_FILES } from "./utils/constants";
import { styles } from "./utils/styles";
import { ViewFilePresenterProps } from "./utils/types";

const ViewFilePresenter: React.FunctionComponent<ViewFilePresenterProps> = ({
  handleClose,
  isOpen,
  asyncState,
  url,
  attachment = {} as Attachment,
  attachments,
  ...props
}) => {
  const type = useMemo(() => attachment.type?.toLowerCase(), [attachment.type]);
  const isPDF = type === PDF;
  const isImage = useMemo(() => SUPPORTED_IMAGE_FILES.includes(attachment.type), [attachment]);
  const classes = styles({ isPDF });
  return (
    <Dialog
      onClose={handleClose}
      open={isOpen}
      classes={{ paper: classes.paper }}
      maxWidth={isImage ? "xl" : "lg"}
      fullWidth={isPDF || isImage}
    >
      <ViewFileTitle
        attachment={attachment}
        attachments={attachments}
        {...props}
      />
      <ViewFileContent
        asyncState={asyncState}
        url={url}
        type={attachment.type}
        handleClose={handleClose}
      />
    </Dialog>
  );
};

export default ViewFilePresenter;
