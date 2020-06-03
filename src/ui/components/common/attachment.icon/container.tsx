import { Grid } from "@material-ui/core";
import _ from "lodash";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Attachment, attachmentsActions, AttachmentType, WatermarkRequest, WatermarkRequestBody } from "../../../../state/ducks/attachments";
import { Nullable } from "../../../../state/ducks/common";
import { ApplicationState } from "../../../../state/reducers";
import FBDynamicValidatorStore from "../../../form.builder/stores/ui/FBDynamicValidatorStore";
import FBStore from "../../../form.builder/stores/ui/FBStore";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { useFormContext } from "../../forms/FormContext";
import { withFormik } from "../../hoc/formik";
import ViewFile from "../view.file/container";
import Menu from "./menu";
import PresenterFactory from "./presenter.factory";
import { AttachmentIconContainerProps, AttachmentIconDispatchProps } from "./utils/types";
import WatermarkContainer from "./watermark/container";
import PasswordDialog from "../../password/dialog";
import { AsyncStatus } from "../../../../state/types";
import { LINE_TYPES } from "../../../../state/ducks/attachments/constants";
import { Password } from "../../password/types";

type DispatchProps = AttachmentIconDispatchProps;

export let SetFile: React.Context<React.Dispatch<React.SetStateAction<Attachment | undefined>>>;

export const AttachmentIconContainer: React.FunctionComponent<AttachmentIconContainerProps> = ({
  name = "",
  download,
  form,
  field,
  value,
  ...other
}) => {

  const { submitForm } = useFormContext();
  const [newWatermarkRequest, setNewWatermarkRequest] = useState<Nullable<WatermarkRequest>>(null);
  const [newWatermakrError, setNewWatermarkError] = useState<string>("");
  const dialogHandler = useDialog();
  const passwordState =  {
    status: AsyncStatus.Idle,
    message: "Message",
  };
  const passwordDialogHandler = useDialog();
  const attachments = value || field?.value as Attachment[] || [];
  const [selectedFile, setSelectedFile] = useState<undefined | Attachment>(undefined);
  const [password, setPassword] = useState<Password>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  SetFile = React.createContext(setSelectedFile);


  const requestWatermarkAction = useActionCreator(attachmentsActions.requestWatermarkedFile);
  const requestWatermarkAsync = useAsync<WatermarkRequest>({
    onSuccess: (data = {} as WatermarkRequest) => {
      setNewWatermarkRequest(data);
    },
    onError: (msg = "Watermark error") => {
      setNewWatermarkError(msg);
    },
  });

  const handleRemove = (attachment: Attachment) => () => {
    if (!form && !field) { return; }
    const filtered = (field.value as Attachment[]).filter((a) => a.id !== attachment.id);

    if (FBStore.mode === "form") {
      let values = {
        ...FBStore.values,
        [name]: filtered,
      };

      if (_.isEmpty(filtered)) {
        values = _.omit(values, name);
      }

      FBStore.setValues(values);
      FBDynamicValidatorStore.validate();
    }
    form.setFieldValue(name, filtered);
    submitForm();
  };

  const handleContextMenu = (file: Attachment) => (evt: React.MouseEvent<HTMLElement>) => {
    evt.preventDefault();
    setSelectedFile(file);
    setAnchorEl(evt.currentTarget);
  };

  const closeContextMenu = () => setAnchorEl(null);

  const handleWatermarkRequest = (attachment: Attachment, attachmentType: AttachmentType) => {
    setNewWatermarkError("");
    setNewWatermarkRequest(null);

    const body: WatermarkRequestBody = {
      attachment: {
        id: attachment.id,
      },
      type: attachmentType,
    };
    requestWatermarkAsync.start(
      requestWatermarkAction,
      body,
      requestWatermarkAsync,
    );
  };

  const passwordSubmit = (values: Password) => {
    setPassword(values);
    passwordDialogHandler.close();
    openFileView();
  };

  const handleIconClick = (attachment: Attachment) => (evt: React.MouseEvent<HTMLElement>) => {
    evt.preventDefault();
    setSelectedFile(attachment);
    if (attachment.lineType === LINE_TYPES.RED_LINE) {
      openPasswordDialog();
    } else {
      openFileView();
    }
  };

  const openPasswordDialog = () => passwordDialogHandler.open();


  const openFileView = () => dialogHandler.open();

  const attachmentsRenderer = attachments.map((attachment) => (
    <PresenterFactory
      {...other}
      key={`attachment-${attachment.id}`}
      name={name}
      attachment={attachment}
      handleRemove={handleRemove}
      form={form}
      field={field}
      handleContextMenu={handleContextMenu}
      handleIconClick = {handleIconClick}
    />
  ));

  return (
    <Grid container={true} spacing={2}>

      <PasswordDialog
        isDialogOpen = {passwordDialogHandler.isOpen}
        onSubmit = {passwordSubmit}
        closeDialog = {passwordDialogHandler.close}
        asyncState = {passwordState}
      />
      <ViewFile
        isOpen={dialogHandler.isOpen}
        handleClose={dialogHandler.close}
        password = {password}
        attachments={attachments}
        attachment={selectedFile}
      />
      <WatermarkContainer
        newWatermarkRequest={newWatermarkRequest}
        newWatermarkError={newWatermakrError}
      />
      <Menu
        handleClose={closeContextMenu}
        anchorEl={anchorEl}
        attachment={selectedFile}
        openFileView={openFileView}
        download= {download}
        handleWatermarkRequest={handleWatermarkRequest}
      />
      {attachmentsRenderer}
    </Grid>
  );
};

export default connect<{}, DispatchProps, {}, ApplicationState>(null, {
  download: attachmentsActions.download,
})(withFormik(AttachmentIconContainer));
