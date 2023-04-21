import { Box } from "@material-ui/core";
import { Form, FormikProps } from "formik";
import { Dictionary, isEmpty, isObject } from "lodash";
import moment from "moment";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { getStartOfDayDateString, TIME_ZONE } from "../../../../../common/utils/date";
import { Group } from "../../../../../state/ducks/auth/types";
import { Owner } from "../../../../../state/ducks/common/types";
import { AsyncState, AsyncStatus } from "../../../../../state/types";
import Approvers from "../../../../change.request/form/approvers";
import { TemplateOption } from "../../../../change.request/form/types";
import { Button } from "../../../../components/forms/fields-next";
import AutocompleteField from "../../../../components/forms/fields/Autocomplete/Autocomplete";
import DatePickerField from "../../../../components/forms/fields/DatePickerField";
import InputField from "../../../../components/forms/fields/Input";
import { required, validator } from "../../../../components/forms/fields/validators";
import FormMessage from "../../../../components/forms/FormMessage";
import FormProgress from "../../../../components/forms/FormProgress";
import Text from "../../../../components/Text";
import { FBFormState, FBSchemaProps } from "../../../../form.builder";
import Colors from "../../../../layout/theme/utils/colors";
import { ApproveAndReleaseFormValues } from "../../types";
import useStyles from "./ApproveAndRelease.styles";

interface Props extends FormikProps<ApproveAndReleaseFormValues> {
  asyncState: AsyncState;
  cancel: () => void;
  isQms: boolean;
  needsSignature: boolean;
  documentTypeGroups: Group[];
  owner: Owner;
  templateOptions: TemplateOption[];
  selectedInvalid: boolean;
  isRecord: boolean;
  isInlineApproval: boolean;
  isDocumentPO: boolean;
  checkedGroups: Group[];
  initialGroups: Group[];
  setCheckedGroups(groups: Group[]): void;
  setFormDocument: (value: string) => void;
  setDocumentType: (value: string) => void;
  setSelectedInvalid: (value: boolean) => void;
  closeDialog: () => void;
  asyncGetDocTypeState: AsyncState;
}

const ApproveAndReleaseForm: React.FunctionComponent<Props> = ({
  cancel,
  asyncState,
  isQms,
  needsSignature,
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
  isDocumentPO,
  checkedGroups,
  setCheckedGroups,
  initialGroups,
  asyncGetDocTypeState,
}) => {

  // MARK: @selectors

  // MARK: @state

  // MARK: @config

  // MARK: @styles
  const classes = useStyles();

  // MARK: @actions

  // MARK: @async

  // MARK: @effects

  // MARK: @helpers
  const showApprovers = !isQms ? needsSignature : isQms;

  // MARK: @methods
  const validateSelectedForm = (option: any) => {
    const { schema } = option || {};
    if (!schema) { return; }
    const formState = new FBFormState({});
    const rules = (schema as FBSchemaProps[]).reduce((acc, item) => {
      if (item.rules) {
        if (isObject(item.rules)) {
          return item.rules;
        }
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
                id: uuidv4(),
                justificationOfChange: `string`,
                descriptionOfChange: `string`,
                proposedDocumentRevision: { id: uuidv4() },
              }],
            };
          }
          case "approvers": {
            return {
              ...acc,
              [item.name]: [{ id: uuidv4() }],
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

  // MARK: @render
  return (
    <Form className={classes.form}>
      <FormMessage asyncState={asyncState} />
      <Box className={classes.formLoading}>
        <FormProgress asyncState={asyncGetDocTypeState} />
        <FormProgress asyncState={asyncState} />
      </Box>
      {showApprovers && (
        <Approvers
          withoutCurrentUser
          shouldShowDAMCheck={!isInlineApproval || !isRecord}
          {
            ...{
              owner,
              values,
              documentTypeGroups,
              isDocumentPO,
              checkedGroups,
              setCheckedGroups,
              initialGroups,
            }
          }
        />
      )}
      {!selectedInvalid && isEmpty(values.approvals) && (
        <DatePickerField
          label="transition.action.effective.date"
          name="effectiveDate"
          size="sm"
          minDate={getStartOfDayDateString(moment().tz(TIME_ZONE).toISOString())}
          value={getStartOfDayDateString(moment().tz(TIME_ZONE).toISOString())}
          validate={validator(required)}
        />
      )}
      {(!isRecord || !isInlineApproval) && (
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
        <Box mb={3} color={Colors.medium_blue}>
          <Text translation="document.revision.tpl.invalid" />
        </Box>
      )}
      {isQms && !selectedInvalid && (
        <InputField
          label="transition.action.password"
          name="password"
          size="sm"
          inputProps={{
            type: "password",
            autoComplete: "new-password",
            classes: {
              root: classes.passwordInput,
            },
          }}
          validate={validator(required)}
        />
      )}
      <Box className={classes.dialogActions}>
        <Button
          kind="ghost"
          id="ApproveAndRelease-cancelButton"
          data-cy="ApproveAndRelease-cancelButton"
          onClick={cancel}
        >
          <Text translation="transition.action.cancel" />
        </Button>
        <Button
          id="ApproveAndRelease-submit"
          data-cy="ApproveAndRelease-submit"
          type="submit"
          disabled={asyncState.status === AsyncStatus.Active}
        >
          <Text translation="transition.action.confirm" />
        </Button>
      </Box>
    </Form>
  );
};

export default ApproveAndReleaseForm;
