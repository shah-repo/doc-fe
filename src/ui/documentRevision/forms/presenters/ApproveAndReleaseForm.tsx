import { Button } from "@material-ui/core";
import { Form, FormikProps } from "formik";
import * as React from "react";
import { Group } from "../../../../state/ducks/auth/types";
import { Owner } from "../../../../state/ducks/common/types";
import { AsyncState, AsyncStatus } from "../../../../state/types";
import Approvers from "../../../change.request/form/approvers";
import InputField from "../../../components/forms/fields/Input";
import { required, validator } from "../../../components/forms/fields/validators";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import SubmitButton from "../../../components/forms/SubmitButton";
import Text from "../../../components/Text";
import { ApproveAndReleaseFormValues } from "../types";
import { styles } from "./ApproveAndRelease.styles";

interface Props extends FormikProps<ApproveAndReleaseFormValues>{
  asyncState: AsyncState;
  cancel: () => void;
  isQms: boolean;
  documentTypeGroups: Group[];
  owner: Owner;
  templateOptions: any[];
}

const ApproveAndReleaseForm: React.FunctionComponent<Props> = ({
  cancel,
  asyncState,
  isQms,
  values,
  documentTypeGroups,
  owner,
  templateOptions,
}) => {
  const classes = styles();
  // const uniqTemplates = uniqBy(templateOptions.map((e, index) => e.forms.map((s) => ({ ...s, docTypeId: e.documentType.id, docTypeName: e.documentType.documentTypeName }))).flat(), "id");
  // const izabraniId = "813cfe96-213d-4819-90a9-2be86ee17b5b";
  // const docTypeByFormIds = templateOptions.map((e) => e.forms.map((s) => ({ ...e.documentType, formIds: s.id } ))).flat();
  // const secondData = docTypeByFormIds.filter((e) => e.formIds === izabraniId);
  return (
    <Form className={classes.form}>
      <FormMessage asyncState={asyncState} />
      {isQms && <Approvers owner={owner} withoutCurrentUser={true} values={values} documentTypeGroups={documentTypeGroups} />}
      {/* <FormControl>
        <FormLabel component="legend">Select Template</FormLabel>
        <FormGroup>
          {uniqTemplates.map((s, index) => <FormControlLabel key={index}
            control={<Checkbox name="template" />}
            label={s.name}
          />)}
        </FormGroup>
      </FormControl> */}
      {/* <RadioGroup name="revisionChangeType">
        {templates.map((s, index) => <RadioButton key={index}
          label={<Text message="Select Template" />}
          value={RevisionChangeType.NextRevision}
          id="RevisionTypeChange-nextRevision"
        />)}
      </RadioGroup> */}
      {isQms && <InputField
        name="password"
        label="transition.action.password"
        inputProps={{ type: "password" }}
        validate={validator(required)}
      />}
      <FormProgress asyncState={asyncState} />
      <SubmitButton
        asyncState={asyncState}
        label="transition.action.confirm"
        fullWidth={false}
        className={classes.submitButton}
        id="ApproveAndRelease-submit"
      />
      <Button
        variant="text"
        color="secondary"
        className={classes.cancelButton}
        disabled={asyncState.status === AsyncStatus.Active}
        onClick={cancel}
        id="ApproveAndRelease-cancelButton"
      >
        <Text translation="transition.action.cancel" />
      </Button>
    </Form>
  );
};

export default ApproveAndReleaseForm;
