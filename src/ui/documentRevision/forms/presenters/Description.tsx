import * as React from "react";
import { useMemo } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import RichTextEditor from "../../../components/forms/fields/RichTextEditor";
import { required, validator } from "../../../components/forms/fields/validators";

interface Props {
  isQms: boolean;
  documentTypeId?: string;
}

const Description: React.FunctionComponent<Props> = ({
  documentTypeId = "",
  isQms,
}) => {
  const intl = useIntl();
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const [placeholder, isVisible, validators] = useMemo(() => {
    const placeholder = isQms ?
      "" :
      intl.formatMessage({ id: "document.revision.no.qms.message" });
    let isVisible = true;
    let validators = isQms ? validator(required) : undefined;

    if (documentType?.documentTypeAcronym === "RC") {
      isVisible = false;
      validators = undefined;
    }
    if (documentType?.documentTypeAcronym === ("WO" || "PO")) {
      validators = undefined;
    }

    return [placeholder, isVisible, validators];
  }, [documentType, intl, isQms]);

  if (!isVisible) {
    return null;
  }

  return (
    <RichTextEditor
      name="description"
      label={`common.description.${documentType?.documentTypeAcronym}`}
      validate={validators}
      editorProps={{ placeholder }}
    />
  );
};

export default React.memo(Description);
