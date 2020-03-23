import { Box } from "@material-ui/core";
import React from "react";
import { AssessmentItem, AssessmentType } from "../../../state/ducks/changeRequest";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import HeaderField from "../../components/common/header.field/field";
import TextEditorField from "../../components/forms/fields/RichTextEditor";
import { withFormik } from "../../components/hoc/formik";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
import { REASONING_OPTIONS } from "../utils/constants";
import AssessmentsReasoning from "./assessments.reasoning";
import { ChangeRequestFormValues } from "./types";

type Props = Partial<FormikHybridFieldProps>;

const Assessments: React.FunctionComponent<Props> = ({ form }) => {
  const itemRenderer = () =>
    Object.values(AssessmentType).map((type) => {
      const { attachments, reasoning }: AssessmentItem = form && form.values.assessments[
        type
      ];

      const actionsRenderer = () => (
        <AttachmentField name={`assessments.${type}.attachments`} />
      );

      // Has attachment
      if ((attachments || []).length > 0 && reasoning) {
        form && form.setFieldValue(`assessments.${type}.reasoning`, undefined);
      }

      const reasoningOptions = REASONING_OPTIONS[type];

      return (
        <Box key={type} mb={4}>
          <TextEditorField
            data-testid={`change.request.${type}.assessment`}
            name={`assessments.${type}.reasoning`}
            label={`change.request.${type}.assessment`}
            actionsRenderer={actionsRenderer}
            hidden={(attachments || []).length > 0}
            editorProps={{
              // eslint-disable-next-line react/jsx-key
              toolbarCustomButtons: [<AssessmentsReasoning reasoningOptions={reasoningOptions} />],
            }}
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
