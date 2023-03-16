// TODO temporary component to supress unused exports. Remove in next PR
import { MenuItem } from "@material-ui/core";
import { FormikProvider, useFormik } from "formik";
import React from "react";
import { Autocomplete, Datepicker, FormikField, PasswordField, SplitButton, SplitButtonMenu } from ".";
import Text from "../../../components/Text";
import useMenu from "../../../hooks/useMenu";
import { Dialog } from "../../dialogs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FieldsShowcase: React.FC = () => {
  const menu = useMenu();
  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      // noop
    },
  });

  return (
    <Dialog
      open={false}
    >
      <FormikProvider value={formik}>
        <FormikField
          name="option"
        >
          <Autocomplete />
        </FormikField>
        <FormikField
          name="date"
        >
          <Datepicker
            value={null}
            onChange={() => { /* noop */ }}
          />
        </FormikField>
        <FormikField
          name="password"
        >
          <PasswordField />
        </FormikField>
        <SplitButton buttonText="common.save" onToggle={menu.open}>
          <SplitButtonMenu anchorEl={menu.anchor}>
            <MenuItem><Text message="common.save.and.exit" /></MenuItem>
          </SplitButtonMenu>
        </SplitButton>
      </FormikProvider>
    </Dialog>
  );
};
