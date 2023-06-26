import { mount, ReactWrapper } from 'enzyme';
import { Form, Formik, FormikProps } from 'formik';
import React from 'react';
import FileField, { FileOwnProps } from './File';

jest.mock('../../Text');

describe('File component tests', () => {
  interface TestFormValues {
    test: File | null
  }
  let formProps: FormikProps<TestFormValues>;

  const getWrapper = (props: Partial<FileOwnProps>): ReactWrapper => {
    const renderForm = (formInstanceProps: FormikProps<TestFormValues>) => {
      formProps = formInstanceProps;

      return (
        <Form>
          <FileField name="test" {...props} />
        </Form>
      );
    };

    return mount(
      <Formik
        initialValues={{ test: null }}
        onSubmit={jest.fn()}
      >
        {renderForm}
      </Formik>,
    );
  };

  it('displays default messages when file is not set', () => {
    const wrapper = getWrapper({});
    const text = wrapper.text();

    expect(text).toContain('document.file.selectText');
    expect(text).toContain('document.file.select');
  });

  it('sets file value and shows file info', () => {
    const wrapper = getWrapper({});
    const input = wrapper.find('input');
    const file = new File(['asdasda'], 'test.pdf');
    const event: any = {
      currentTarget: {
        files: [file],
      },
    };

    (input.prop('onChange') as (arg: any) => void)(event);

    const text = wrapper.text();
    expect(text).not.toContain('document.file.selectText');
    expect(text).toContain('test.pdf');

    expect(formProps.values.test).toEqual(file);
  });
});
