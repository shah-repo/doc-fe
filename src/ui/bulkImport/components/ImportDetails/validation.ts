import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  processId: Yup.string().required('This field is required'),
});
