import { Formik, Form as FormikForm, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { createComment, setCommentsStatus } from "store/ProfileSlice";
import { MainButton, PopupHeader } from "elements/ui";
import { MeetingField, ResponsePopup } from "elements/service";
import { RootState } from "store";
import { useEffect } from "react";

import styles from "./CreateComment.module.scss";

export const CreateComment = (props: { userId: number }) => {
  // Redux
  const { status, error } = useSelector(
    (state: RootState) => state.profile.comments
  );
  const dispatch = useDispatch();

  // Null status
  useEffect(() => {
    dispatch(setCommentsStatus("idle"));
  }, [dispatch]);

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
    <div className={styles.container}>
      <ResponsePopup
        responseResult={status}
        responseTexts={{
          resolved: "Вы успешно оставили комменатрий пользователю",
          rejected: "Не получилось оставить комменатрий. Попробуйте еще раз :(",
        }}
      >
        <PopupHeader title="Настройки" />
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validate={validate}
          validateOnMount={true}
        >
          <FormikForm className={styles.main_section}>
            <h3 className={styles.title}>Ваш комменатрий</h3>
            <MeetingField
              component="textarea"
              placeholder="Начните писать"
              name="text"
              type="text"
            />
            <div className={styles.bottom_section}>
              <div className={styles.errors_messages}>
                <ErrorMessage name="text" component="p" />
                {error && <p>error</p>}
              </div>
              <div className={styles.button_container}>
                <MainButton type="medium" buttonProps={{ type: "submit" }}>
                  Оставить комментарий
                </MainButton>
              </div>
            </div>
          </FormikForm>
        </Formik>
      </ResponsePopup>
    </div>
  );
};
