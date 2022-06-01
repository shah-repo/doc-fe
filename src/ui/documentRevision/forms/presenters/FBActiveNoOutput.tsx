import { Box, createStyles, makeStyles, Theme } from "@material-ui/core";
import { useFormikContext } from "formik";
import { get } from "lodash";
import * as React from "react";
import { useSelector } from "react-redux";
import { ValueType } from "react-select";
import { SM } from "../../../../App";
import { Permission } from "../../../../state/ducks/auth/types";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { DocumentRevision, DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions/types";
import AutocompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../../components/forms/fields/Autocomplete/types";
import { requiredAtLeastOne, validator } from "../../../components/forms/fields/validators";
import useGetHasPermission from "../../../hooks/useGetHasPermission";
import { checkIsTypeCanBeOutput, checkIsTypeMustBeOutput } from "../../helpers/checkDocumentGroup";
import { isDocumentRevisionInDraft } from "../../helpers/documentRevisionStatus";
import { getFBSchemeByDocType } from "../../helpers/getFBSchemeByDocType";
import { getActiveDocumentTypes } from "../transform";
import RenderHtmlField from "./RenderHtmlField";

interface Props {
  status: DocumentRevisionStatus;
  version: number;
  docRevId?: string;
  isDisabled: boolean;
  outputDocs: OptionType[];
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    outputGrey: {
      color: `${theme.palette.text.disabled}`,
    },
  }),
);
const FBActiveNoOutput: React.FunctionComponent<Props> = ({
  status,
  version,
  docRevId,
  isDisabled = false,
  outputDocs,
}) => {
  const classes = styles();
  const formik = useFormikContext();
  const { _documentRevisionFormState } = SM.useStores();
  const [selectedValues, setSelectedValues] = React.useState<any>([]);

  const disabled: boolean = (docRevId !== undefined) || isDisabled;
  const isdocRevStatusDraft =
    isDocumentRevisionInDraft(status);
  const isdocRevVersionOne = version === 1;
  const outputDocEnabled: boolean =
    (isdocRevVersionOne && isdocRevStatusDraft) || !disabled;

  const documentTypes = getActiveDocumentTypes(useSelector(documentTypeSelectors.getDocumentTypeFormOptions));
  const documentTypesById = useSelector(documentTypeSelectors.byId);
  const canUpdateHTML = useGetHasPermission(Permission.HTML_UPDATE);

  React.useEffect(() => {
    setSelectedValues(get(formik.values, "outputDocumentTypes", []));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const outputDocumentTypeOptions: OptionType[] = React.useMemo(
    () =>
      documentTypes.reduce((acc: OptionType[], document) => {
        if (checkIsTypeMustBeOutput(document.groupOptions) || checkIsTypeCanBeOutput(document.groupOptions)) {
          acc.push({ value: document.id, label: document.documentTypeName });
        }
        return acc;
      }, []),
    [documentTypes],
  );

  const handleTypeChange = (value: ValueType<OptionType>) => {
    setSelectedValues(value ?? []);
    const formValue = {
      ...formik.values as Partial<DocumentRevision>,
      outputDocumentTypes: value as OptionType[],
    };
    const scheme = getFBSchemeByDocType(
      formValue,
      documentTypesById,
      _documentRevisionFormState?.schema,
    );

    _documentRevisionFormState?.setFBSchema(scheme);
  };

  return (
    <Box>
      <AutocompleteField
        name="outputDocumentTypes"
        label="document.output.type"
        autocompleteProps={{
          id: "formTemplate.outputDocumentTypes",
          isMulti: true,
          closeMenuOnSelect: false,
          className: !outputDocEnabled ? classes.outputGrey : "",
          isOptionDisabled: (option) => selectedValues?.length >= 1,
        }}
        options={outputDocumentTypeOptions}
        validate={validator(requiredAtLeastOne)}
        isDisabled={isDisabled}
        onChange={handleTypeChange}
      />
      {canUpdateHTML && <RenderHtmlField isDisabled={isDisabled}/>}
    </Box>
  );
};

export default FBActiveNoOutput;
