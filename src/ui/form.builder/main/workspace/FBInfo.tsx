import { Button } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import FBForm from "../../components/form/FBForm";
import FBTextField from "../../components/inputs/FBTextField";

const FBInfo: React.FunctionComponent<{}> = () => {

  return (
    <FBForm>
      <FBTextField label="form.builder.name" name="name" required={true} />
      {/* <FBSelect
        label="form.builder.type"
        name="documentType"
        required={true}
        options={documentRevisionTypeOption()}
      /> */}
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

export default FBInfo;
