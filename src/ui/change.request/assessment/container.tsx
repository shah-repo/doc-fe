import { FieldProps } from "formik";
import React from "react";
import { ChangeRequestFormValues } from "../../changeRequest/forms/types";
import Presenter from "./presenter";

export type Props = FieldProps<ChangeRequestFormValues>;

const Container: React.FunctionComponent<Props> = ({
  form,
}) => <Presenter form={form} />;

export default Container;
