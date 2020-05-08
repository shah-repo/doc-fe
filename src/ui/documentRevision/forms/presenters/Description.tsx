import * as React from "react";
import { useMemo } from "react";
import { useIntl } from "react-intl";
import RichTextEditor from "../../../components/forms/fields/RichTextEditor";
import { required, validator } from "../../../components/forms/fields/validators";

interface Props {
  isQms: boolean;
}

const Description: React.FunctionComponent<Props> = ({
  isQms,
}) => {
  const intl = useIntl();
  const validators = useMemo(() => isQms ? validator(required) : undefined, [isQms]);
  const placeholder = useMemo(() =>
    isQms ?
      "" :
      intl.formatMessage({ id: "document.revision.no.qms.message" })
  , [intl, isQms]);

  return (
    <RichTextEditor
      name="description"
      label="common.description"
      validate={validators}
      editorProps={{ placeholder }}
    />
  );
};

export default React.memo(Description);
