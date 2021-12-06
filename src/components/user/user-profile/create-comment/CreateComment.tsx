import { Formik, Form as FormikForm, ErrorMessage, Field } from "formik";
import {useDispatch} from "react-redux";
import { createComment } from "store/ProfileSlice";

export const CreateComment = (props: { userId: number }) => {
  const dispatch = useDispatch();

  // Initial values
  const initialValues = {
    text: "" as string,
  };

  // Validate
  const validate = (values: typeof initialValues) => {
    const { text } = values;
    const errors: { [field: string]: string } = {};

    if (text.length < 1) errors.text = "Комментарий не может быть пустым";
    if (text.length > 256) errors.text = "Слишком длинный комментарий";

    return errors;
  };

  // Submit
  const onSubmit = async (values: typeof initialValues) => {
    const { text } = values;
    await dispatch(createComment({ userId: props.userId, text: text }));
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      validateOnMount={true}
    >
      <FormikForm>
        <Field as='textarea' placeholder="Начните писать" name="text" type="text" />
        <div >
          <ErrorMessage name="text" component="p" />
        </div>
        <button type="submit">Оставить комментарий</button>
      </FormikForm>
    </Formik>
  );
};
