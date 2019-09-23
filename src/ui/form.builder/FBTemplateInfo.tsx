import { Button } from "@material-ui/core";
import React from "react";
import Text from "../components/Text";
import { documentRevisionTypeOption } from "../document.revision/utils/helpers";
import FBForm from "./components/form/FBForm";
import FBSelect from "./components/inputs/select/FBSelect";
import FBTextField from "./components/inputs/textfield/FBTextField";

const FBTemplateInfo: React.FunctionComponent<{}> = () => {

  const onSubmit = (values: any) => {
    // tslint:disable-next-line: no-console
    console.log(values);
  };

  return (
    <FBForm onSubmit={onSubmit}>
      <FBTextField label="form.builder.name" name="fb_name" required={true} />
      <FBSelect
        label="form.builder.type"
        name="fb_type"
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

export default FBTemplateInfo;
