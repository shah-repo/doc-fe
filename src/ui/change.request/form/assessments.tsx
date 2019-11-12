import { Box } from "@material-ui/core";
import React from "react";
import { AssessmentItem, AssessmentType } from "../../../state/ducks/changeRequest";
import { ChangeRequestFormValues } from "../../changeRequest/forms/types";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import HeaderField from "../../components/common/header.field/field";
import TextEditorField from "../../components/forms/fields/TextEditor";
import { withFormik } from "../../components/hoc/formik";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
import { customHandlers, customToolbarAction, getCustomContainers } from "../utils/assessment";

type Props = Partial<FormikHybridFieldProps>;

const Assessments: React.FunctionComponent<Props> = ({ form }) => {
  const itemRenderer = () =>
    Object.values(AssessmentType).map((type) => {
      const { attachments, reasoning }: AssessmentItem = form!.values.assessments[
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
        <Box key={type} mb={4}>
          <TextEditorField
            name={`assessments.${type}.reasoning`}
            label={`change.request.${type}.assessment`}
            actionsRenderer={actionsRenderer}
            hidden={(attachments || []).length > 0}
            customHandlers={customHandlers(type)}
            customToolbarAction={customToolbarAction(type)}
            customContainers={getCustomContainers(type)}
          />
          <AttachmentIconField name={`assessments.${type}.attachments`} />
        </Box>
      );
    });

  return (
    <Box mb={6}>
      <Box mb={2} mt={3}>
        <HeaderField dataProp="common.assessments" />
      </Box>
      {itemRenderer()}
    </Box>
  );
};

export default withFormik<any, ChangeRequestFormValues>(Assessments);
