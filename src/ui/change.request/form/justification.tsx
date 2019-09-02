import React from "react";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import TextEditorField from "../../components/forms/fields/TextEditor";

export const Justification: React.FunctionComponent<{}> = () => {

  const actionsRenderer = () => <AttachmentField name="justifications.attachments" />;

  return (
    <React.Fragment>
      <TextEditorField
        name="justifications.description"
        label="cr.justification"
        actionsRenderer={actionsRenderer}
      />
      <AttachmentIconField name="justifications.attachments" />
    </React.Fragment>
  );
};

export default Justification;
