import { useFormikContext } from "formik";
import * as React from "react";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import CheckboxField from "../../../components/forms/fields/Checkbox";

interface Props {
  revisionChangeType?: RevisionChangeType ;
  documentTypeId?: string;
}

const RetrainField: React.FunctionComponent<Props> = ({
  documentTypeId = "",
  revisionChangeType,
}) => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const isVisible = useMemo(() => {
    switch (documentType?.documentTypeAcronym) {
      case "PO":
      case "RC":
      case "WO":
      case "SUP":
        return false;
      default:
        return true;
    }
  }, [documentType]);
  const formik = useFormikContext();
  useEffect(() => {
    if (revisionChangeType === RevisionChangeType.AdministrativeChange) {
      formik.setFieldValue("retrain", false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revisionChangeType]);

  if (!isVisible) {
    return null;
  }

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
