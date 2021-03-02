import { uniqBy } from "lodash";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import CreatableField from "../../components/forms/fields/Autocomplete/Creatable";
import CustomLabelTooltip from "../../hooks/docCustomization/CustomLabelTooltip";
import { useTitle } from "../../hooks/docCustomization/useCustomization";

interface OwnProps {
  name: string;
  documentTypeId?: string;
  disabled?: boolean;
}

type Props = OwnProps;

const Title: React.FunctionComponent<Props> = ({
  documentTypeId = "",
  ...props
}) => {
  const { isVisible, label, tooltipConfig, validation: validators } = useTitle(documentTypeId);
  const documents = useSelector(documentRevisionsSelectors.getDocumentRevisionsList);
  const options = useMemo(
    () =>
      uniqBy(documents, (document) => document.name)
        .map((document) => ({
          label: document.name,
          value: document.name,
        })),
    [documents],
  );

  if (!isVisible) {
    return null;
  }

  return (
    <CustomLabelTooltip {...{ tooltipConfig }}>
      <CreatableField
        name="name"
        validate={validators}
        creatableProps={{ id: "Title-field" }}
        isDisabled={props.disabled}
        {...{ options, label }}
      />
    </CustomLabelTooltip>
  );
};

export default React.memo(Title);
