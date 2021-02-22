import MenuItem from "@material-ui/core/MenuItem";
import StarsRoundedIcon from "@material-ui/icons/StarsRounded";
import React from "react";
import { LINE_TYPES } from "../../../../state/ducks/attachments";
import { DocumentRevision, documentRevisionsActions, DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import { FormHeaderContext } from "../../../documentRevision/forms/DocumentRevisionForm.presenter";
import { isDocumentRevisionInStatus } from "../../../documentRevision/helpers/documentRevisionStatus";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import { toastError } from "../../notifications";
import Text from "../../Text";

interface Props {
  handleClose?: any;
  attachment: any;
  documentRevision?: DocumentRevision;
}

const MenuItemSetPrimary: React.FunctionComponent<Props> = ({
  handleClose,
  attachment = {},
  documentRevision,
}) => {
  const setAsPrimaryAction = useActionCreator(documentRevisionsActions.setPrimaryAttachment);
  const setAsPrimaryAsync = useAsync({
    onError: (error) => toastError(error as string),
  });
  const isDocumentPage = Boolean(React.useContext(FormHeaderContext));

  if (!isDocumentPage) {
    return null;
  }
  if (attachment.id === documentRevision?.primaryAttachment?.id) {
    return null;
  }

  const isNewDocument = isDocumentPage && !documentRevision?.id;
  const canSetAsPrimary =  isDocumentRevisionInStatus(
    [DocumentRevisionStatus.Draft, DocumentRevisionStatus.PendingChange],
    documentRevision?.status
  ) && documentRevision?.document?.canAccess && attachment.lineType !== LINE_TYPES.RED_LINE;

  if (!canSetAsPrimary || isNewDocument) {
    return null;
  }

  const handleClick = () => {
    setAsPrimaryAsync.start(setAsPrimaryAction, documentRevision?.id, attachment.id, setAsPrimaryAsync);
    handleClose();
  };

  return (
    <MenuItem data-cy={"set.attachment.as.primary"} onClick={handleClick}>
      <StarsRoundedIcon color="primary" fontSize="small" style={{ marginRight: 5 }} />
      <Text translation="attachment.set.as.primary" />
    </MenuItem>
  );
};

export default MenuItemSetPrimary;
