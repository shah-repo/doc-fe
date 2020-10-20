import { Box, Button } from "@material-ui/core";
import { Form, FormikProps } from "formik";
import { Dictionary, isEmpty } from "lodash";
import moment from "moment";
import * as React from "react";
import * as generateUuid from "uuid/v4";
import { getStartOfDayDateString, TIME_ZONE } from "../../../../common/utils/date";
import { Group } from "../../../../state/ducks/auth/types";
import { Owner } from "../../../../state/ducks/common/types";
import { AsyncState, AsyncStatus } from "../../../../state/types";
import Approvers from "../../../change.request/form/approvers";
import { TemplateOption } from "../../../change.request/form/types";
import AutocompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";
import DatePickerField from "../../../components/forms/fields/DatePickerField";
import { required, validator } from "../../../components/forms/fields/validators";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import SubmitButton from "../../../components/forms/SubmitButton";
import Text from "../../../components/Text";
import { FBFormState, FBSchemaProps } from "../../../form.builder";
import Colors from "../../../layout/theme/utils/colors";
import { ApproveAndReleaseFormValues } from "../types";
import { styles } from "./ApproveAndRelease.styles";

interface Props extends FormikProps<ApproveAndReleaseFormValues> {
  asyncState: AsyncState;
  cancel: () => void;
  isQms: boolean;
  documentTypeGroups: Group[];
  owner: Owner;
  templateOptions: TemplateOption[];
  selectedInvalid: boolean;
  isRecord: boolean;
  isInlineApproval: boolean;
  setFormDocument: (value: string) => void;
  setDocumentType: (value: string) => void;
  setSelectedInvalid: (value: boolean) => void;
  closeDialog: () => void;
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
  setSelectedInvalid,
  selectedInvalid,
  isRecord,
  isInlineApproval,
}) => {
  const classes = styles();

  const validateSelectedForm = (option: any) => {
    const { schema } = option || {};
    if (!schema) { return; }
    const formState = new FBFormState({});
    const rules = (schema as FBSchemaProps[]).reduce((acc, item) => {
      if (item.rules) {
        acc[item.name || ""] = item.rules;
      }
      return acc;
    }, {});

    const generatedValues =
      (schema as FBSchemaProps[]).reduce<object>((acc, item) => {
        // fields effectiveDate,  documentRevisions and approvers are required in all CR forms
        // they will be automatically set by backend.
        switch (item.name) {
          case "effectiveDate": {
            return {
              ...acc,
              [item.name]: new Date().toISOString(),
            };
          }
          case "documentRevisions": {
            return {
              ...acc,
              [item.name]: [{
                id: generateUuid(),
                justificationOfChange: `string`,
                descriptionOfChange: `string`,
                proposedDocumentRevision: { id: generateUuid() },
              }],
            };
          }
          case "approvers": {
            return {
              ...acc,
              [item.name]: [{ id: generateUuid() }],
            };
          }
          default: {
            return acc;
          }
        }
      }, {});

    formState.rules = (rules as Dictionary<any>);
    formState.setValues(generatedValues);
    formState?.validate((valid) => {
      if (valid) {
        setSelectedInvalid(false);
        return;
      }
      setSelectedInvalid(true);
    });
  };


  if (templateOptions.length === 1) {
    setFormDocument(templateOptions[0].value);
    setDocumentType(templateOptions[0].docTypeId);
    validateSelectedForm(templateOptions[0]);
  }

  return (
    <Form className={classes.form}>
      <FormMessage asyncState={asyncState} />
      {isQms && (
        <Approvers
          withoutCurrentUser={true}
          shouldShowDAMCheck={!isInlineApproval || !isRecord}
          {
            ...{
              owner,
              values,
              documentTypeGroups,
            }
          }
        />
      )}
      {isEmpty(values.approvals) && (
        <DatePickerField
          label="transition.action.effective.date"
          name="effectiveDate"
          size="mdw"
          minDate={getStartOfDayDateString(moment().tz(TIME_ZONE).toISOString())}
          value={getStartOfDayDateString(moment().tz(TIME_ZONE).toISOString())}
          validate={validator(required)}
        />
      )}
      {!(isRecord && isInlineApproval) && templateOptions.length > 1 && (
        <AutocompleteField
          name="formDocument"
          size="sm"
          label="common.approve.and.release.template"
          autocompleteProps={{ id: "FormList-selectForm" }}
          options={templateOptions}
          onClick={(option) => {
            setFormDocument(option.value);
            setDocumentType(option.docTypeId);
            validateSelectedForm(option);
          }}
        />
      )}
      {selectedInvalid && (
        <Box mt={-3} mb={3} color={Colors.medium_blue}>
          <Text translation="document.revision.tpl.invalid" />
        </Box>
      )}
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
