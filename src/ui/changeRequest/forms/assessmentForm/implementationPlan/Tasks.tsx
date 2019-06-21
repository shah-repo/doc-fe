import { FieldArrayRenderProps, FieldProps, FieldArray } from "formik";
import { Button } from "@material-ui/core";
import React from "react";
import Text from "../../../../components/Text";

interface Props extends FieldArrayRenderProps {}

const Container: React.FunctionComponent<Props> = () => {

  return (
    <div>
      <Button>
        <Text message="changeRequest.assessmentForm.addTask" />
      </Button>
    </div>
  );
};

export default Container;
