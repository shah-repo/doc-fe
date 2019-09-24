import { Button } from "@material-ui/core";
import React from "react";
import Text from "../components/Text";
import { documentRevisionTypeOption } from "../document.revision/utils/helpers";
import { withFormBuilderStore } from "./components/common/hocs/withFormBuilderStore";
import { FBStoreProps } from "./components/common/utils/types";
import FBForm from "./components/form/FBForm";
import FBSelect from "./components/inputs/select/FBSelect";
import FBTextField from "./components/inputs/textfield/FBTextField";

const FBTemplateInfo: React.FunctionComponent<FBStoreProps> = ({
  setStates,
}) => {

  const onSubmit = (values: any) => {
    setStates(values);
  };

  return (
    <FBForm onSubmit={onSubmit}>
      <FBTextField label="form.builder.name" name="name" required={true} />
      <FBSelect
        label="form.builder.type"
        name="documentType"
        required={true}
        options={documentRevisionTypeOption()}
      />
      <Button
        type="submit"
        variant="contained"
        color="secondary"
      >
        <Text message="form.builder.create" />
      </Button>
    </FBForm>
  );
};

export default withFormBuilderStore(FBTemplateInfo);
