import { Box, Typography } from "@material-ui/core";
import React from "react";
import * as generateUuid from "uuid/v4";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBForm, FBTextField } from "../..";
import Text from "../../../components/Text";
import { FBPOApprovalMatrixFormProps } from "../FBPOApprovalMatrix.types";

const FBPOApprovalMatrixForm: React.FunctionComponent<FBPOApprovalMatrixFormProps> = ({
  initialValues = {},
  signatureStages,
  children,
}) => (
  <FBForm {...{ initialValues }}>
    <FBTextField
      name="id"
      hidden={true}
      defaultValue={generateUuid()}
    />
    <FBTextField
      label="form.builder.field.level.name"
      name="name"
      rules="required"
    />
    <FBTextField
      inputProps={{ type: "number" }}
      label="form.builder.field.limit"
      name="limit"
      rules="required"
    />
    {signatureStages?.map((level) => (
      <Box key={level} borderTop="1px solid lightgray">
        <Typography variant="h6" style={{ paddingTop: 20 }}>
          <Text translation="form.builder.signature.label" values={{ number: level }} />
        </Typography>
        <FBTextField
          name={`signatures.${level - 1}.id`}
          hidden={true}
          defaultValue={generateUuid()}
        />
        <FBTextField
          name={`signatures.${level - 1}.signatureStage`}
          hidden={true}
          defaultValue={level}
        />
        <FBAutocompleteAsync
          name={`signatures.${level - 1}.groups`}
          label="document.revision.selected.groups"
          multiple={true}
          optionId={FBAutocompleteAsyncOption.officialGroups}
          optionValueType="id"
          defaultValue={[]}
        />
        <FBAutocompleteAsync
          name={`signatures.${level - 1}.employees`}
          label="document.revision.selected.users"
          multiple={true}
          optionId={FBAutocompleteAsyncOption.employees}
          optionValueType="id"
          defaultValue={[]}
        />
      </Box>) )}
    {children}
  </FBForm>
);


export default FBPOApprovalMatrixForm;


// const FBPOApprovalMatrixForm: React.FunctionComponent<FBPOApprovalMatrixFormProps> = ({
//   initialValues = {} as Dictionary<any>,
//   onSubmit,
//   closeDialog,
//   name,
//   validateForm,
//   employees,
//   groupOptions,
//   signatureStages,
// }) => {
//   const renderForm = (props) => {
//     const { errors } = props;
//     return (
//       <Form>
//         <FBTextField
//           label="form.builder.field.level.name"
//           name={`${name}-formValues.name`}
//         />
//         <Error error={errors.name} />
//         <FBTextField
//           inputProps={{ type: "number" }}
//           label="form.builder.field.limit"
//           name={`${name}-formValues.limit`}
//         />
//         <Error error={errors.limit} />
//         {signatureStages?.map((level) => (
//           <Box key={level} borderTop="1px solid lightgray">
//             <Typography variant="h6" style={{ paddingTop: 20 }}>
//               <Text translation="form.builder.signature.label" values={{ number: level }} />
//             </Typography>
//             <AutocompleteField
//               name={`${name}-formValues.signature${level}groups`}
//               label="document.revision.selected.groups"
//               options={groupOptions}
//               autocompleteProps={{
//                 isMulti: true,
//                 isClearable: true,
//               }}
//             />
//             <AutocompleteField
//               name={`${name}-formValues.signature${level}employees`}
//               label="document.revision.selected.users"
//               options={toMembersOptions(employees)}
//               autocompleteProps={{
//                 isMulti: true,
//                 isClearable: true,
//               }}
//             />
//           </Box>) )}
//         <Box textAlign="right">
//           <FBButton
//             variant="outlined"
//             onClick={closeDialog}
//             label="common.cancel"
//           />
//           <FBButton
//             buttonType="submit"
//             label="common.done"
//           />
//         </Box>
//       </Form>
//     );
//   };

//   return (
//     <Formik
//       initialValues={initialValues}
//       onSubmit={onSubmit}
//       validate={validateForm}
//       validateOnChange
//     >
//       {renderForm}
//     </Formik>
//   );
// };

// export default withFBPOApprovalMatrixForm(FBPOApprovalMatrixForm);
