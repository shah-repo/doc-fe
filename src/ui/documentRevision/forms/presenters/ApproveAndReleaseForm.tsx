import { Button } from "@material-ui/core";
import { Form, FormikProps } from "formik";
import _ from "lodash";
import * as React from "react";
import { Group } from "../../../../state/ducks/auth/types";
import { Owner } from "../../../../state/ducks/common/types";
import { AsyncState, AsyncStatus } from "../../../../state/types";
import Approvers from "../../../change.request/form/approvers";
import AutocompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";
import DatePickerField from "../../../components/forms/fields/DatePickerField";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import SubmitButton from "../../../components/forms/SubmitButton";
import Text from "../../../components/Text";
import { ApproveAndReleaseFormValues } from "../types";
import { styles } from "./ApproveAndRelease.styles";

interface Props extends FormikProps<ApproveAndReleaseFormValues> {
  asyncState: AsyncState;
  cancel: () => void;
  isQms: boolean;
  documentTypeGroups: Group[];
  owner: Owner;
  templateOptions: any[];
  setFormDocument: (value: string) => void;
  setDocumentType: (value: string) => void;
}

const ApproveAndReleaseForm: React.FunctionComponent<Props> = ({
  cancel,
  asyncState,
  isQms,
  values,
  documentTypeGroups,
  owner,
  templateOptions,
  setFormDocument,
  setDocumentType,
}) => {
  const classes = styles();

  const formTemplateOptions = _.flatten(
    templateOptions.map((template) =>
      template.forms.map((form) => ({
        documentType: template.documentType.id,
        label: form.name,
        value: form.id,
      }))
    )
  );

  return (
    <Form className={classes.form}>
      <FormMessage asyncState={asyncState} />
      {isQms && <Approvers owner={owner} withoutCurrentUser={true} values={values}
        documentTypeGroups={documentTypeGroups} />}
      <AutocompleteField
        name="formDocument"
        size="sm"
        label="common.approve.and.release.template"
        autocompleteProps={{ id: "FormList-selectForm" }}
        options={formTemplateOptions}
        onClick={(option) => {
          setFormDocument(option.value);
          setDocumentType(option.documentType);
        }}
      />
      <DatePickerField
        label="transition.action.effective.date"
        name="effectiveDate"
      />
      <FormProgress asyncState={asyncState} />
      <SubmitButton
        asyncState={asyncState}
        label="transition.action.confirm"
        fullWidth={false}
        className={classes.submitButton}
        id="ApproveAndRelease-submit"
        data-cy="ApproveAndRelease-submit"
      />
      <Button
        variant="text"
        color="secondary"
        className={classes.cancelButton}
        disabled={asyncState.status === AsyncStatus.Active}
        onClick={cancel}
        id="ApproveAndRelease-cancelButton"
        data-cy="ApproveAndRelease-cancelButton"
      >
        <Text translation="transition.action.cancel" />
      </Button>
    </Form>
  );
};

export default ApproveAndReleaseForm;
