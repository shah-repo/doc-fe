import * as React from "react";
import { RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import CheckboxField from "../../../components/forms/fields/Checkbox";

interface Props {
  revisionChangeType?: RevisionChangeType ;
}

const RetrainField: React.FunctionComponent<Props> = ({
  revisionChangeType,
}) => {
  const disabled = revisionChangeType === RevisionChangeType.AdministrativeChange;
  return (
    <CheckboxField
      name="retrain"
      label="document.revision.trainingRequired"
      checkboxProps={{ disabled }}
    />
  );
};

export default RetrainField;
