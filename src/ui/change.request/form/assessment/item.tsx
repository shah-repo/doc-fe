import { Box, IconButton, Typography } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/core/styles";
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

export type Props = AssessmentItemProps & WithStyles <typeof styles>;

export const Item: React.FunctionComponent<Props> = ({
  classes,
  type,
  form,
}) => {
  const { reasoning, attachment } = form.values.assessments[type];
  const dialogHandler = useDialog();

  const openDialog = () => dialogHandler.open();

  const isValid = () => {
    if (attachment || reasoning) { return true; }
    return false;
  };

  const clearAttachment = () => {
    const values = form.values;
    values.assessments[type] = { attachment: null, reasoning: null };
    form.setValues(values);
  };

  const formRenderer = () => <Form form={form} type={type} />;

  const reasoningRenderer = () => (
    <Box component="div" m={1}>
      <IconButton className={classes.close} onClick={openDialog}>
        <SubtitlesOutlined />
      </IconButton>
      <Dialog
        title={`change.request.${type}.assessment`}
        contentRenderer={formRenderer}
        dialogHandler={dialogHandler}
        actions={[DialogAction.Ok]}
      />
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
      <Box component="div" m={1}>
        {attachment && `${attachment.name}.${attachment.type}`}
      </Box>
    </Typography>
  );

  return (
    <Box component="div" m={1} className={classes.paragraph}>
      <Typography component="p" >
        <Text message={`change.request.${type}.assessment`} />
      </Typography>
      {!attachment && reasoningRenderer()}
      {attachment && attachmentRenderer()}
    </Box>
  );
};

export default withStyles(styles)(Item);
