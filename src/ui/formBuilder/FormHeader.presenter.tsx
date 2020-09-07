import React from "react";
import formStyles from "./FormBuilder.module.css";

interface FormProps {
  status: string;
  title: string;
  formNumber: string;
}

const FormHeaderPresenter: React.FunctionComponent<FormProps> = ({
  status, title, formNumber,
}) => (
  <div className={formStyles.formHeader}>
    <div className={formStyles.formHeaderInfoContainer}>
      <button className={formStyles.formStatus}>{status}</button>
      <h2 className={formStyles.formTitle}>{title}</h2>
      <h2 className={formStyles.formNumber}>{formNumber}</h2>
    </div>
  </div>
);

export default FormHeaderPresenter;
