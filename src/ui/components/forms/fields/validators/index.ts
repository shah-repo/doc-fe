import { isEmpty, isEqual } from 'lodash';
import * as Yup from 'yup';
import { Translation } from '../../../../translations/types';

const reactQuillEmptyString = '<p><br></p>';

export type Validator = (value: any) => Translation | undefined;

export const required: Validator = (value) => {
  if (value === reactQuillEmptyString || isEmpty(value)) {
    return 'validators.required';
  }
};

export const email: Validator = (value: string) => {
  // https://stackoverflow.com/a/34096956
  // eslint-disable-next-line max-len
  if (!/^[a-z0-9!'#$%&*+/=?^_`{|}~-]+(?:\.[a-z0-9!'#$%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-zA-Z]{2,}$/i.test(value)) {
    return 'validators.email';
  }
};

export const passwordSchema = Yup.string()
  .min(8, 'validator.password.min')
  .required('validators.required')
  .matches(/(?=.*?[A-Z])/, 'validator.password.upper.case')
  .matches(/(?=.*?[a-z])/, 'validator.password.lower.case')
  .matches(/(?=.*?[0-9])/, 'validator.password.number')
  .matches(/(?=.*?[$*.{}?"!@#%&/,><':;|_~`\\^[\]()-])/, 'validator.password.spec.char');

export const confirmPasswordSchema = Yup.string()
  .oneOf([Yup.ref('password'), null], 'validator.match.passwords')
  .required('validator.confirm');

export const confirmResetPasswordSchema = Yup.string()
  .oneOf([Yup.ref('newPassword'), null], 'validator.match.passwords')
  .required('validator.confirm');

export const emailSchema = Yup.string()
  .email('validators.email')
  .required('validators.required');

export const requiredSchema = Yup.string()
  .required('validators.required');

const validatorFactory = (...validators: Validator[]): Validator => (value: any): Translation | undefined => {
  for (const validatorFn of validators) {
    const error = validatorFn(value);

    if (error !== undefined) {
      return error;
    }
  }
};

export const validator = (() => {
  const memo: {
    validators: Validator[]
    finalValidator: Validator
  }[] = [];

  return (...validators: Validator[]): Validator => {
    const memoValidator = memo.find((el) => isEqual(el.validators, validators));

    if (memoValidator) {
      return memoValidator.finalValidator;
    }

    const newValidator = {
      validators,
      finalValidator: validatorFactory(...validators),
    };

    memo.push(newValidator);

    return newValidator.finalValidator;
  };
})();

export const timeTravelValidator = Yup.object().shape({
  year: Yup.string()
    .required('async.task.filed.error')
    .matches(/^[0-9]+$/),
  month: Yup.string()
    .required('async.task.filed.error')
    .matches(/^[0-9]+$/),
  day: Yup.string()
    .required('async.task.filed.error')
    .matches(/^[0-9]+$/),
  hour: Yup.string()
    .required('async.task.filed.error')
    .matches(/^[0-9]+$/),
  minute: Yup.string()
    .required('async.task.filed.error')
    .matches(/^[0-9]+$/),
  second: Yup.string()
    .required('async.task.filed.error')
    .matches(/^[0-9]+$/),
});
