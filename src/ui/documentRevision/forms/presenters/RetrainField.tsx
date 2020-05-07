import { FormikHelpers } from "formik";
import * as React from "react";
import { useEffect } from "react";
import { RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import CheckboxField from "../../../components/forms/fields/Checkbox";

interface OwnProps {
  revisionChangeType?: RevisionChangeType ;
}

type Props = OwnProps & Pick<FormikHelpers<any>, "setFieldValue">;

const RetrainField: React.FunctionComponent<Props> = ({
  revisionChangeType,
  setFieldValue,
}) => {
  useEffect(() => {
    if (revisionChangeType === RevisionChangeType.AdministrativeChange) {
      setFieldValue("retrain", false);
    }
  }, [revisionChangeType, setFieldValue]);
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
