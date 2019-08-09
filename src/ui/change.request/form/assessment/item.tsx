import { Box, IconButton, Typography } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import {
  CancelOutlined,
  InsertDriveFile,
  InsertDriveFileOutlined,
  SubtitlesOutlined,
} from "@material-ui/icons";
import React from "react";
import Dialog from "../../../components/dialogs/Dialog";
import { DialogAction } from "../../../components/dialogs/utils/types";
import Text from "../../../components/Text";
import useDialog from "../../../hooks/useDialog";
import { AssessmentItemProps } from "../../utils/types";
import Form from "./form";
import styles from "./styles";
import AttachmentIconField from "../../../components/common/attachment.icon/field";

export type Props = AssessmentItemProps & WithStyles <typeof styles>;

export const Item: React.FunctionComponent<Props> = ({
  classes,
  type,
  form,
}) => {
  const { reasoning, attachments } = form.values.assessments[type];
  const dialogHandler = useDialog();

  const openDialog = () => dialogHandler.open();

  const isValid = () => {
    if (!_.isEmpty(attachments) || reasoning) { return true; }
    return false;
  };

  const clearAttachment = () => {
    const values = form.values;
    values.assessments[type] = { attachments: null, reasoning: null };
    form.setValues(values);
  };

  const formRenderer = () => <Form form={form} type={type} />;

  const reasoningRenderer = () => (
    <Box component="div" m={1}>
      <IconButton className={classes.close} onClick={openDialog}>
        <SubtitlesOutlined />
      </IconButton>
      <div />
      <InsertDriveFileOutlined
        className={classes.icon}
        color={isValid() ? "secondary" : "error"}
      />
    </Box>
  );

  const attachmentRenderer = () => (
    <Typography variant="body2" component="div" gutterBottom={true}>
      <Box component="div" m={1}>
        <IconButton className={classes.close} onClick={clearAttachment} >
          <CancelOutlined />
        </IconButton>
      </Box>
      <InsertDriveFile className={classes.icon} />
      <AttachmentIconField name={`assessments.${type}.attachments`} />
    </Typography>
  );

  return (
    <Box component="div" m={1} className={classes.paragraph}>
      <Typography component="p" >
        <Text message={`change.request.${type}.assessment`} />
      </Typography>
      {_.isEmpty(attachments) && reasoningRenderer()}
      {!_.isEmpty(attachments) && attachmentRenderer()}
      <Dialog
        title={`change.request.${type}.assessment`}
        contentRenderer={formRenderer}
        dialogHandler={dialogHandler}
        actions={[DialogAction.Ok]}
      />
    </Box>
  );
};

export default withStyles(styles)(Item);
