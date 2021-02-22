import { Box } from "@material-ui/core";
import React, { useState } from "react";
import { AttachmentDownloadResponse, attachmentsActions } from "../../../../state/ducks/attachments";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import { Attachment } from "../../../change.request/form/types";
import Text from "../../../components/Text";
import { FBInputProps } from "../../../form.builder";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import POAttachment from "./POAttachment";

interface Props {
  documentRevision: DocumentRevision;
}

const POAttachments: React.FunctionComponent<Props> = ({
  documentRevision,
}) => {
  const [attachments] = useState<Attachment[]>(() => {
    const attachmentList = documentRevision.attachments || [];
    const schema = documentRevision.formDocument?.formTemplate?.schema;
    const fileUploadItems = ((schema || []) as FBInputProps[])
      .filter((schemaItem) => schemaItem.type === "fileupload");

    const fbAttachmentList = fileUploadItems.map((item) => documentRevision.formInput?.[item.name || ""] || []);
    return attachmentList.concat(fbAttachmentList).flat();
  });
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

  if (attachments.length === 0) {
    return null;
  }

  return (
    <Box marginTop="5px">
      <Box component="span" fontWeight="fontWeightBold">
        <Text translation="common.attachments" />
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
