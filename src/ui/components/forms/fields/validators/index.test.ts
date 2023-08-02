import { email, positiveNumber, required, validator } from '.';

describe('validators tests', () => {
  describe('required validator tests', () => {
    it('returns undefined when value is provided', () => {
      expect(required('OK')).toBeUndefined();
    });

    it('returns error when value is null', () => {
      expect(required(null)).toEqual('validators.required');
    });

    it('returns error when value is undefined', () => {
      expect(required(undefined)).toEqual('validators.required');
    });

    it('returns error when value is empty string', () => {
      expect(required('')).toEqual('validators.required');
    });
  });

  describe('email validator tests', () => {
    it('returns undefined when correct value is provided', () => {
      expect(email('dino@codecons.com')).toBeUndefined();
    });

    it('returns error when value is incorrect email', () => {
      expect(email('dinocodecons.com')).toEqual('validators.email');
    });
  });

  describe('posititiveNumber validator tests', () => {
    it('returns undefined when undefined is provided', () => {
      expect(positiveNumber(undefined)).toBeUndefined();
    });
    it('returns undefined when positive number is provided', () => {
      expect(positiveNumber(2)).toBeUndefined();
    });
    it('returns undefined when positive number in form of string is provided', () => {
      expect(positiveNumber('2')).toBeUndefined();
    });
    it('returns error when negative number is provided', () => {
      expect(positiveNumber(-2)).toEqual('validators.positive.number');
    });
    it('returns error when string is provided', () => {
      expect(positiveNumber('foo')).toEqual('validators.positive.number');
    });
  });

  describe('validators tests', () => {
    const customValidator = validator(required, email);

    it('returns undefined when correct value is provided', () => {
      expect(customValidator('dino@codecons.com')).toBeUndefined();
    });

    it('returns required error when value is not provided', () => {
      expect(customValidator(null)).toEqual('validators.required');
    });

    it('returns email error when value is incorrect email', () => {
      expect(customValidator('dinocodecons.com')).toEqual('validators.email');
    });
  });
});
