import { Dialog } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import { StyledMenuListIcon } from "../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon";
import { StyledMenuListItem } from "../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem";
import { StyledMenuListItemText } from "../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText";
import SM from "../../../App/Shifamed/Utils/SM/SM";
import { ReactComponent as DownloadHTMLIcon } from "../../../assets/images/download_html.svg";
import { ReactComponent as ViewPDFIcon } from "../../../assets/images/view_pdf.svg";
import { attachmentsActions } from "../../../state/ducks/attachments";
import { AttachmentDownloadResponse } from "../../../state/ducks/attachments/types";
import { PDF } from "../../../state/ducks/documentRevisions/types";
import { AsyncStatus } from "../../../state/types";
import AsyncButton from "../../components/AsyncButton";
import ViewFileContent from "../../components/common/view.file/components/dialog.content";
import { styles } from "../../components/common/view.file/utils/styles";
import { toastError } from "../../components/notifications";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";

interface Props {
  pdf?: PDF;
  renderAsButton?: boolean;
  isPO?: boolean;
}
const DownloadHTML: React.FunctionComponent<Props> = ({
  pdf, renderAsButton, isPO,
}) => {
  const isNewLayout = SM.isNewLayout;
  const intl = useIntl();
  const dialog = useDialog();
  const [URL, setURL] = React.useState<string>("");
  const classes = styles({ isPDF: true });

  const action = useActionCreator(attachmentsActions.getAssetUrl);
  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      setURL(downloadInfo?.url || "");
      dialog.open();
    },
    onError: () => {
      toastError(intl.formatMessage({ id: "document.revision.download.pdf.error" }));
    },
  });

  if (!pdf) {
    return null;
  }

  const handleClick = () => {
    async.start(action, pdf.s3Url, async);
  };

  let button: React.ReactElement | null = null;

  if (isNewLayout) {
    const isActive = async.asyncState.status === AsyncStatus.Active;

    button = renderAsButton
      ? null
      : (
        <StyledMenuListItem disabled={isActive} button alignItems="flex-start">
          <StyledMenuListIcon>
            {isPO ? <ViewPDFIcon /> : <DownloadHTMLIcon/>}
          </StyledMenuListIcon>
          <StyledMenuListItemText
            data-cy="downloadHtml"
            primary={<Text translation={ isPO ?  "common.view.pdf" : "common.download.html"} />}
            onClick={handleClick}
          />
        </StyledMenuListItem>
      );
  } else {
    button = (
      <AsyncButton
        label="common.download.pdf"
        data-cy="downloadHtml"
        onClick={handleClick}
        asyncState={async.asyncState}
        color="secondary"
        variant="outlined"
      />
    );
  }

  return (
    <>
      {button}
      <Dialog
        onClose={dialog.close}
        open={dialog.isOpen}
        classes={{
          paper: classes.paper,
        }}
        maxWidth={"lg"}
        fullWidth={true}
      >
        <ViewFileContent
          asyncState={async.asyncState}
          url={URL}
          type={"PDF"}
          handleClose={dialog.close}
        />
      </Dialog>
    </>
  );
};

export default DownloadHTML;
