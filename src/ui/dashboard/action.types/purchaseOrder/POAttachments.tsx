import { Box } from "@material-ui/core";
import React from "react";
import { AttachmentDownloadResponse, attachmentsActions } from "../../../../state/ducks/attachments";
import { Attachment } from "../../../change.request/form/types";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import POAttachment from "./POAttachment";

interface Props {
  attachments: Attachment[];
}

export const POAttachments: React.FunctionComponent<Props> = ({
  attachments,
}) => {
  const downloadAction = useActionCreator(attachmentsActions.download);
  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      window.onbeforeunload = null;
      downloadInfo && window.open(downloadInfo.url, "_blank");
    },
  });
  const handleDownload = (attachment: Attachment) => () => {
    async.start(downloadAction, attachment, async);
  };

  return (
    <Box marginTop="5px">
      <Box component="span" fontWeight="fontWeightBold">
        <Text translation="common.attachment" />
        {": "}
      </Box>
      {
        attachments.map((attachment) => (
          <POAttachment key={attachment.id} attachment={attachment} download={handleDownload(attachment)} />
        ))
      }
    </Box>
  );
};

export default POAttachments;
