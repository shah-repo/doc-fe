import { Box } from "@material-ui/core";
import React from "react";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import TextEditorField from "../../components/forms/fields/TextEditor";

export const Justification: React.FunctionComponent<{}> = () => {
  const actionsRenderer = () => (
    <AttachmentField name="justifications.attachments" />
  );

  return (
    <Box mb={5}>
      <TextEditorField
        name="justifications.description"
        label="cr.justification"
        actionsRenderer={actionsRenderer}
      />
      <Box mt={-5}>
        <AttachmentIconField name="justifications.attachments" />
      </Box>
    </Box>
  );
};

export default Justification;
