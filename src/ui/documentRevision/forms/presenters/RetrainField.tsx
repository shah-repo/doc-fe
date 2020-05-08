import { useFormikContext } from "formik";
import * as React from "react";
import { useEffect } from "react";
import { RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import CheckboxField from "../../../components/forms/fields/Checkbox";

interface Props {
  revisionChangeType?: RevisionChangeType ;
}

const RetrainField: React.FunctionComponent<Props> = ({
  revisionChangeType,
}) => {
  const formik = useFormikContext();
  useEffect(() => {
    if (revisionChangeType === RevisionChangeType.AdministrativeChange) {
      formik.setFieldValue("retrain", false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revisionChangeType]);
  const disabled = revisionChangeType === RevisionChangeType.AdministrativeChange;
  return (
    <CheckboxField
      name="retrain"
      label="document.revision.trainingRequired"
      checkboxProps={{ disabled }}
    />
  );
};

export default React.memo(RetrainField);
