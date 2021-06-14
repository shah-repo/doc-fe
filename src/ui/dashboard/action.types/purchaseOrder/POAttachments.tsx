import { Box } from "@material-ui/core";
import React from "react";
import { attachmentsActions } from "../../../../state/ducks/attachments";
import { AttachmentDownloadResponse } from "../../../../state/ducks/attachments/types";
import { Attachment } from "../../../change.request/form/types";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import POAttachment from "./POAttachment";

interface Props {
  docRevAttachments: Attachment[];
}

const POAttachments: React.FunctionComponent<Props> = ({
  docRevAttachments,
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

  if (docRevAttachments.length === 0) {
    return null;
  }

  return (
    <Box marginTop="5px">
      <Box component="span" fontWeight="fontWeightBold">
        <Text translation="common.attachments" />
        {": "}
      </Box>
      {
        docRevAttachments.map((attachment) => (
          <POAttachment key={attachment.id} attachment={attachment} download={handleDownload(attachment)} />
        ))
      }
    </Box>
  );
};

export default POAttachments;
