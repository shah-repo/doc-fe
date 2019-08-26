import { Box, Grid } from "@material-ui/core";
import React from "react";
import { AssessmentType } from "../../../state/ducks/changeRequest";
import { ChangeRequestFormValues } from "../../changeRequest/forms/types";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import HeaderField from "../../components/common/header.field/field";
import EditableSelectField from "../../components/forms/fields/EditableSelect/container";
import { withFormik } from "../../components/hoc/formik";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
import { assessmentStatementOption } from "../utils/helpers";

type Props = Partial<FormikHybridFieldProps>;

const Assessments: React.FunctionComponent<Props> = ({ form }) => {
  const itemRenderer = () =>
    Object.values(AssessmentType).map((type) => {
      const { attachments, reasoning } = form!.values.assessments[
        type as AssessmentType
      ];

      const actionsRenderer = () => (
        <AttachmentField name={`assessments.${type}.attachments`} />
      );

      // Has attachment
      if ((attachments || []).length > 0 && reasoning) {
        form!.setFieldValue(`assessments.${type}.reasoning`, undefined);
      }

      return (
        <Box key={type} mb={attachments && attachments.length > 0 ? 0 : 4}>
          <HeaderField
            dataProp={`change.request.${type}.assessment`}
            size="sm"
            actionsRenderer={actionsRenderer}
          />
          <EditableSelectField
            name={`assessments.${type}.reasoning`}
            options={assessmentStatementOption()}
            includeEmpty={true}
          />
          <AttachmentIconField name={`assessments.${type}.attachments`} />
        </Box>
      );
    });

  return (
    <Box>
      <Box mb={4} mt={3}><HeaderField dataProp="common.assessments" /></Box>
      {itemRenderer()}
    </Box>
  );
};

export default withFormik<any, ChangeRequestFormValues>(Assessments);
