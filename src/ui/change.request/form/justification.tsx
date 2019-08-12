import React from "react";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import HeaderField from "../../components/common/header.field/field";
import FilledInputField from "../../components/forms/fields/FilledInput";

export const Justification: React.FunctionComponent<{}> = () => {

  const actionsRenderer = () => <AttachmentField name="justifications.attachments" />;

  return (
    <React.Fragment>
      <HeaderField dataProp="cr.justification" actionsRenderer={actionsRenderer} />
      <FilledInputField
        name="justifications.description"
        label="common.description"
        inputProps={{ multiline: true, rows: "2" }}
      />
      <AttachmentIconField name="justifications.attachments" />
    </React.Fragment>
  );
};

export default Justification;
