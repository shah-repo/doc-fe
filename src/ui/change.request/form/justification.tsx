import React from "react";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import InputField from "../../components/forms/fields/Input";

export const Justification: React.FunctionComponent<{}> = () => {

  const actionsRenderer = () => <AttachmentField name="justifications.attachments" />;

  return (
    <React.Fragment>
      <InputField
        name="justifications.description"
        label="cr.justification"
        inputProps={{ multiline: true, rows: "2" }}
        actionsRenderer={actionsRenderer}
      />
      <AttachmentIconField name="justifications.attachments" />
    </React.Fragment>
  );
};

export default Justification;
