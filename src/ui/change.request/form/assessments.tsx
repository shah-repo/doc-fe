import { Box, Grid } from "@material-ui/core";
import { ErrorMessage } from "formik";
import React from "react";
import { AssessmentType } from "../../../state/ducks/changeRequest";
import { ChangeRequestFormValues } from "../../changeRequest/forms/types";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import HeaderField from "../../components/common/header.field/field";
import EditableSelectField from "../../components/forms/fields/EditableSelect/container";
import FilledInputField from "../../components/forms/fields/FilledInput";
import { withFormik } from "../../components/hoc/formik";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
import { assessmentStatementOption } from "../utils/helpers";

type Props = Partial<FormikHybridFieldProps>;

const Assessments: React.FunctionComponent<Props> = ({
  form,
}) => {
  const itemRenderer = () => Object.values(AssessmentType).map((type) => {

    const { attachments, reasoning} = form!.values.assessments[type as AssessmentType];

    const actionsRenderer = () => <AttachmentField name={`assessments.${type}.attachments`} />;

    // Has attachment
    if ((attachments || []).length > 0 && reasoning) {
      form!.setFieldValue(`assessments.${type}.reasoning`, undefined);
    }

    return (
      <Grid key={type} item={true} xs={12}>
        <HeaderField
          dataProp={`change.request.${type}.assessment`}
          size="sm"
          actionsRenderer={actionsRenderer}
        />
        <EditableSelectField
          name={`assessments.${type}.reasoning`}
          label="common.reasoning"
          options={assessmentStatementOption()}
          includeEmpty={true}
        />
        <AttachmentIconField name={`assessments.${type}.attachments`} />
      </Grid>
    );
  });

  return (
    <Box>
     <ErrorMessage name="assessments" />
      <HeaderField dataProp="common.assessments" />
      <FilledInputField
        name="assessments.description"
        label="common.description"
        inputProps={{ multiline: true, rows: "2" }}
      />
      <Grid container={true} spacing={3}>
        {itemRenderer()}
      </Grid>
    </Box>
  );
};

export default withFormik<any, ChangeRequestFormValues>(Assessments);
