import * as Yup from 'yup';
import Config from '../../../../config';

const isProduction = Config.isProduction;

// Store the valid S3 prefix in a variable
const validS3Prefix = isProduction
  ? 's3://bulk-import-test/'
  : 's3://enlil-unity-bulk-import/';

export const validationSchema = Yup.object().shape({
  link: Yup.string()
    .test(
      'is-valid-s3-link',
      `Invalid link. Must start with ${validS3Prefix}`, // Use the variable here
      (value) => {
        if (!value) return true; // If no link, skip validation
        return value.startsWith(validS3Prefix); // Use the variable here
      },
    ),
  files: Yup.array().of(Yup.mixed()), // Add any necessary file validation
});
