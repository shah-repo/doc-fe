import { FieldProps, Form, Formik } from "formik";
import React from "react";
import { connect } from "react-redux";
import {
  Attachment as AttachmentModel,
  attachmentsActions,
} from "../../../../state/ducks/attachments";
import { AssessmentType } from "../../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../../state/reducers";
import {
  ChangeRequestFormValues,
  FileUploadFormValues,
} from "../../../changeRequest/forms/types";
import FileField from "../../../components/forms/fields/File";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import SubmitButton from "../../../components/forms/SubmitButton";
import useAsync from "../../../hooks/useAsync";
import { AssessmentDispatchProps } from "../../utils/types";

type DispatchProps = AssessmentDispatchProps;
type OwnProps = FieldProps<ChangeRequestFormValues>;
export type Props = OwnProps & DispatchProps & {
  type: AssessmentType;
};

export const Attachment: React.FunctionComponent<Props> = ({
  upload,
  form,
  type,
}) => {

  const async = useAsync<AttachmentModel>({
    onSuccess: (attachment?: AttachmentModel) => {
      const formAssessment = form.values.assessments;
      formAssessment[type] = { attachment };
      form.setValues({
        ...form.values,
        assessments: formAssessment,
      });
    },
  });

  const onSubmitt = (values: FileUploadFormValues) => {
    async.start(upload, values.file as File, async);
  };

  const formRenderer = () => (
    <Form>
      <FormMessage asyncState={async.asyncState} />
      <FileField name="file" />
      <FormProgress asyncState={async.asyncState} />
      <SubmitButton
        asyncState={async.asyncState}
        label="document.file.upload"
        fullWidth={true}
      />
    </Form>
  );

  return (
    <Formik
      render={formRenderer}
      initialValues={{ file: undefined }}
      onSubmit={onSubmitt}
    />
  );
};

export default connect<{}, DispatchProps, OwnProps, ApplicationState>(null, {
  upload: attachmentsActions.upload,
})(Attachment);
