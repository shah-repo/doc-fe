import { Translation } from "../../../../translations/types";

export const reactQuillEmptyString = "<p><br></p>";

type Validator = (value: any) => Translation | undefined;

export const required: Validator = (value) => {
  if (value === undefined || value === null || value === "" || value === reactQuillEmptyString) {
    return "validators.required";
  }
};

export const email: Validator = (value: string) => {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return "validators.email";
  }
};

export const requiredAtLeastOne: Validator = (value) => {
  if (!value || value.length === 0) {
    return "validators.requiredAtLeastOne";
  }
}

export const validator = (...validators: Validator[]): Validator => (value: any): Translation | undefined => {
  for (const validatorFn of validators) {
    const error = validatorFn(value);

    if (error !== undefined) {
      return error;
    }
  }
};
