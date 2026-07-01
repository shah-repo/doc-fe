import { docId, email, positiveNumber, required, validator } from '.';

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

  describe('docId validator tests', () => {
    const acronym = 'LHRS-';

    it('returns undefined when valid docId is provided', () => {
      expect(docId('LHRS-123', acronym)).toBeUndefined();
    });

    it('returns error when suffix is empty', () => {
      expect(docId('LHRS-', acronym)).toEqual('validators.required');
    });

    it('returns error when value is empty string', () => {
      expect(docId('', acronym)).toEqual('validators.required');
    });

    it('returns error when value is null', () => {
      expect(docId(null, acronym)).toEqual('validators.required');
    });

    it('returns error when value is undefined', () => {
      expect(docId(undefined, acronym)).toEqual('validators.required');
    });

    it('returns error when extracted value is empty with missing acronym', () => {
      expect(docId('')).toEqual('validators.required');
    });

    it('handles value with multiple occurrences of acronym', () => {
      expect(docId('LHRS-LHRS-123', acronym)).toBeUndefined();
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
