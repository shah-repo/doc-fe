import { uniqBy } from "lodash";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import CreatableField from "../../components/forms/fields/Autocomplete/Creatable";
import CustomLabelTooltip from "../../hooks/docCustomization/CustomLabelTooltip";
import { useTitle } from "../../hooks/docCustomization/useCustomization";

interface OwnProps {
  name: string;
  documentTypeId?: string;
  disabled?: boolean;
  value?: string;
}

type Props = OwnProps;

const Title: React.FunctionComponent<Props> = ({
  documentTypeId = "",
  name = "name",
  ...props
}) => {
  const intl = useIntl();
  const { isVisible, label, tooltipConfig } = useTitle(documentTypeId);
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

  if (options.length === 0 && props.value) {
    options.push({
      label: props.value,
      value: props.value,
    });
  }
  if (!isVisible) {
    return null;
  }

  return (
    <CustomLabelTooltip {...{ tooltipConfig }}>
      <CreatableField
        name={name}
        creatableProps={{ id: "Title-field" }}
        isDisabled={props.disabled}
        placeholder={intl.formatMessage({ id: "form.builder.enter.title" })}
        labelProps={{ margin: 0 }}
        {...{ options, label }}
      />
    </CustomLabelTooltip>
  );
};

export default React.memo(Title);
