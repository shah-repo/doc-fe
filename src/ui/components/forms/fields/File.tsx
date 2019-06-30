import { Link, Typography, WithStyles, withStyles } from "@material-ui/core";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import Text from "../../Text";
import Field, { FieldOwnProps } from "./Field";
import styles from "./File.styles";

export type FileOwnProps = FieldOwnProps;

type FileProps = FileOwnProps & WithStyles<typeof styles> & FormikFieldProps;

const File: React.FunctionComponent<FileProps> = ({ classes, ...fieldProps }) => {
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    fieldProps.form.setFieldValue(fieldProps.field.name, event.currentTarget.files && event.currentTarget.files[0]);
  };

  const fileName = fieldProps.field.value && (fieldProps.field.value as File).name;

  return (
    <Field {...fieldProps}>
      <input hidden={true} id="upload-file" type="file" onChange={onChange} onBlur={onChange} />
      <label htmlFor="upload-file" className={classes.container}>
        <Typography className={classes.text}>
          {fileName || <Text translation="document.file.selectText" />}
        </Typography>
        <Link component="span" variant="button" className={classes.button}>
          <Text translation="document.file.select" />
        </Link>
      </label>
    </Field>
  );
};

const FileWithStyles = withStyles(styles)(File);

type FileFieldProps = FileOwnProps & FieldConfig;

const FileField: React.FunctionComponent<FileFieldProps> = (props) =>
  <FormikField component={FileWithStyles} {...props} />;

export default FileField;
