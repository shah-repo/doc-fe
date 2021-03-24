import { CircularProgress, createStyles, Link, makeStyles, Theme } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import React, { useState } from "react";
import { attachmentsActions } from "../../../../state/ducks/attachments";
import { AttachmentDownloadResponse } from "../../../../state/ducks/attachments/types";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions/types";
import { AsyncStatus } from "../../../../state/types";
import Text from "../../../components/Text";
import { isDocumentRevisionDeprecated, isDocumentRevisionInDraft, isDocumentRevisionObsolete, isDocumentRevisionReleased } from "../../../documentRevision/helpers/documentRevisionStatus";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { Translation } from "../../../translations/types";
import { toastError } from "../../notifications";
import PasswordDialog from "../../password/dialog";
import { Password } from "../../password/types";
import AttachmentRedLineWarningDialog from "../attachment.redline.warning/dialog";


interface Props {
  isAttachmentEmpty: boolean;
  docRevId: string;
  containsRedline: boolean;
  docRevStatus: DocumentRevisionStatus;
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    downloadLabel: ({ isAttachmentEmpty }) => ({
      flex: "0 0 50%",
      display: isAttachmentEmpty ? "none" : "flex",
      justifyContent: "flex-end",
      paddingRight: "25px",
    }),
    icon: {
      verticalAlign: "middle",
      maxHeight: "20px",
      maxWidth: "20px",
    },
    link: {
      cursor: "pointer",
    },
  }));

const AttachmentDownloadAllButton: React.FunctionComponent<Props> = ({
  isAttachmentEmpty,
  docRevId,
  containsRedline,
  docRevStatus,
}) => {

  const passwordState = {
    status: AsyncStatus.Idle,
    message: "",
  };

  const warningState = {
    status: AsyncStatus.Idle,
    message: "",
  };

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const downloadAllAttachments = useActionCreator(attachmentsActions.downloadAllAttachments);
  const downloadAllAttachmentsPassword = useActionCreator(attachmentsActions.downloadAllAttachmentsPassword);
  const passwordDialogHandler = useDialog();
  const redlineWarningDialogHandler = useDialog();

  const classes = styles({ isAttachmentEmpty });


  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      setIsDownloading(false);
      window.onbeforeunload = null;
      downloadInfo && window.open(downloadInfo.url, "_parent");
    },
    onError: (message) => {
      setIsDownloading(false);
      message && toastError(message as unknown as string);
    },
  });


  const passwordSubmit = (values: Password) => {
    async.start(downloadAllAttachmentsPassword, docRevId, async, values.password);
    passwordDialogHandler.close();
  };

  const warningPasswordText = (): Translation => {

    if (isDocumentRevisionObsolete(docRevStatus)) {
      return "common.attachment.redline.warning.download.obsoletedAll";
    }

    if (isDocumentRevisionDeprecated(docRevStatus)) {
      return "common.attachment.redline.warning.download.deprecatedAll";
    }

    return "common.attachment.redline.warning.download.redlineAll";
  };


  const warningSubmit = () => {
    redlineWarningDialogHandler.close();
    passwordDialogHandler.open();
  };

  const handleAllDownload = (documentRevisionId: string, password: string | undefined) => () => {
    if (isDocumentRevisionInDraft(docRevStatus)) {
      setIsDownloading(true);
      async.start(downloadAllAttachments, documentRevisionId, async);
    } else if (!containsRedline && isDocumentRevisionReleased(docRevStatus)) {
      setIsDownloading(true);
      async.start(downloadAllAttachments, documentRevisionId, async);
    } else {
      setIsDownloading(true);
      redlineWarningDialogHandler.open();
    }
  };

  const closeDialog = () => {
    redlineWarningDialogHandler.close();
    setIsDownloading(false);
  };

  return (
    <>
      <AttachmentRedLineWarningDialog
        isDialogOpen={redlineWarningDialogHandler.isOpen}
        onSubmit={warningSubmit}
        closeDialog={closeDialog}
        asyncState={warningState}
        translationText={warningPasswordText()}
        translationButtonText="common.attachment.redline.warning.download.labelAll"
      />

      <PasswordDialog
        isDialogOpen={passwordDialogHandler.isOpen}
        onSubmit={passwordSubmit}
        closeDialog={passwordDialogHandler.close}
        asyncState={passwordState}
      />
      <label
        htmlFor={"button-file"}
        className={classes.downloadLabel}
        onClick={handleAllDownload(docRevId, undefined)}>
        <Link
          className={classes.link}
          component="span"
          variant="button"
          id="AttachmentFieldPresenter-downloadAllButton"
        >
          {isDownloading ? <CircularProgress className={classes.icon} /> : <GetAppIcon className={classes.icon} />}
          <Text translation="common.download.all.files" />
        </Link>
      </label>
    </>
  );
};

export default AttachmentDownloadAllButton;
