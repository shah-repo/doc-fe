import { Fab, Typography, WithStyles, withStyles } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { FieldArrayRenderProps, FormikProps } from "formik";
import React from "react";
import Text from "../../components/Text";
import DocumentApproverInput from "./DocumentApproverInput";
import styles from "./DocumentApprovers.styles";
import { DocumentFormValues } from "./types";

interface Props extends WithStyles<typeof styles>, FieldArrayRenderProps {
  form: FormikProps<DocumentFormValues>;
}

const DocumentApprovers: React.FunctionComponent<Props> = ({ classes, push, remove, form }) => {
  const removeApprover = (index: number) => () => remove(index);
  const addApprover = () => push("");

  const Approvers = (form.values.approvers || []).map((approver: string, index: number) => (
    <DocumentApproverInput key={index} index={index} removeApprover={removeApprover(index)} />
  ));

  return (
    <div className={classes.container}>
      <div className={classes.title}>
        <Typography variant="subtitle1">
          <Text translation="common.approvers" />:
        </Typography>
        <Fab size="small" color="secondary" aria-label="Create" onClick={addApprover}>
          <Add fontSize="small" />
        </Fab>
      </div>
      <div className={classes.content}>
        {Approvers}
      </div>
    </div>
  );
};

export default withStyles(styles)(DocumentApprovers);
