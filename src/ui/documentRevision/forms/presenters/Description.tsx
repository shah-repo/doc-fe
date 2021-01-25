import { FieldValidator } from "formik";
import * as React from "react";
import { useIntl } from "react-intl";
import RichTextEditor from "../../../components/forms/fields/RichTextEditor";
import CustomLabelTooltip from "../../../hooks/docCustomization/CustomLabelTooltip";
import useDescription from "../../../hooks/docCustomization/useDescription";

interface Props {
  isQms: boolean;
  documentTypeId?: string;
  isDisabled?: boolean;
}

const Description: React.FunctionComponent<Props> = ({
  documentTypeId = "",
  isQms,
  isDisabled = false,
}) => {
  const intl = useIntl();
  const { isVisible, label, tooltipConfig, validation: validators } = useDescription(documentTypeId, isQms);
  const placeholder: string = isQms ?
    "" :
    intl.formatMessage({ id: "document.revision.no.qms.message" });

  if (!isVisible) {
    return null;
  }

  return (
    <CustomLabelTooltip {...{ tooltipConfig }}>
      <RichTextEditor
        name="description"
        label={label}
        validate={validators as FieldValidator}
        editorProps={{ placeholder, readOnly: isDisabled }}
      />
    </CustomLabelTooltip>
  );
};

export default React.memo(Description);
