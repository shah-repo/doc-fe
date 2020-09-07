import { useFormikContext } from "formik";
import * as React from "react";
import { useEffect } from "react";
import { RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import CheckboxField from "../../../components/forms/fields/Checkbox";
import { useTraining } from "../../../hooks/docCustomization/useCustomization";

interface Props {
  revisionChangeType?: RevisionChangeType ;
  documentTypeId?: string;
  isDisabled?: boolean;
  isRecord?: boolean;
}

const RetrainField: React.FunctionComponent<Props> = ({
  documentTypeId = "",
  revisionChangeType,
  isDisabled = false,
  isRecord,
}) => {

  const [isVisible] = useTraining(documentTypeId);
  const formik = useFormikContext();
  useEffect(() => {
    if (revisionChangeType === RevisionChangeType.AdministrativeChange) {
      formik.setFieldValue("retrain", false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revisionChangeType]);

  if (!isVisible || isRecord) {
    return null;
  }

  const disabled = revisionChangeType === RevisionChangeType.AdministrativeChange || isDisabled;
  return (
    <CheckboxField
      name="retrain"
      label="document.revision.trainingRequired"
      checkboxProps={{ disabled }}
    />
  );
};

export default React.memo(RetrainField);
