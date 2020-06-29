import { Box, createStyles, makeStyles, Theme } from "@material-ui/core";
import * as React from "react";
import { useSelector } from "react-redux";
import { Permission } from "../../../../state/ducks/auth/types";
import { DocumentRevisionStatus } from "../../../../state/ducks/documentRevisions";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import AutocompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../../components/forms/fields/Autocomplete/types";
import { requiredAtLeastOne, validator } from "../../../components/forms/fields/validators";
import useGetHasPermission from "../../../hooks/useGetHasPermission";
import RenderHtmlField from "./RenderHtmlField";

interface Props {
  status: DocumentRevisionStatus;
  version: number;
  docRevId?: string;
  isDisabled: boolean;
  outputDocs: OptionType[];
}

export const styles = makeStyles((theme: Theme) =>
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
  const documentTypes = useSelector(documentTypeSelectors.getDocumentTypeFormOptions);
  const canUpdateHTML = useGetHasPermission(Permission.HTML_UPDATE);
  const outputDocumentTypeOptions: OptionType[] = React.useMemo(
    () =>
      documentTypes.reduce((acc: OptionType[], document) => {
        if (
          document.groupOptions?.includes("MUST_BE_OUTPUT") ||
          document.groupOptions?.includes("CAN_BE_OUTPUT")
        ) {
          acc.push({ value: document.id, label: document.documentTypeName });
        }
        return acc;
      }, []),
    [documentTypes],
  );
  const disabled: boolean = (docRevId !== undefined) || isDisabled;
  const isdocRevStatusDraft =
    status === DocumentRevisionStatus.Draft;
  const isdocRevVersionOne = version === 1;
  const outputDocEnabled: boolean =
    (isdocRevVersionOne && isdocRevStatusDraft) || !disabled;

  return (
    <Box mt={4}>
      <AutocompleteField
        name="outputDocumentTypes"
        label="document.output.type"
        autocompleteProps={{
          id: "formTemplate.outputDocumentTypes",
          isMulti: true,
          closeMenuOnSelect: false,
          className: !outputDocEnabled ? classes.outputGrey : "",
        }}
        options={outputDocumentTypeOptions}
        validate={validator(requiredAtLeastOne)}
        isDisabled={isDisabled}
      />
      {canUpdateHTML && <RenderHtmlField isDisabled={isDisabled}/>}
    </Box>
  );
};

export default FBActiveNoOutput;
