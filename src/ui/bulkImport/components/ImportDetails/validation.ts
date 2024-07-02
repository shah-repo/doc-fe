import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  processType: Yup.string().required('common.required'),
});
