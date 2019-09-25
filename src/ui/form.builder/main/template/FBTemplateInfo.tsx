import { Button } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { documentRevisionTypeOption } from "../../../document.revision/utils/helpers";
import FBForm from "../../components/form/FBForm";
import FBSelect from "../../components/inputs/select/FBSelect";
import FBTextField from "../../components/inputs/textfield/FBTextField";
import { templateStore, view } from "../../stores/templateStore";
import { FBTemplateStore } from "../../stores/utils/types";

const FBTemplateInfo: React.FunctionComponent<{}> = () => {

  const handleSubmit = (values: FBTemplateStore) =>
    templateStore.setState(values);

  return (
    <FBForm onSubmit={handleSubmit}>
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

export default view(FBTemplateInfo);
