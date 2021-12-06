import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { useState } from "react";
import { unregister } from "store/authSlice";
import { Formik, Form as FormikForm, ErrorMessage } from "formik";
import { changeMyInfo } from "store/ProfileSlice";
import { Loading } from "components/general";
import { MainButton, PopupHeader } from "elements/ui";
import { Button } from "./button/Button";

import styles from "./EditProfile.module.scss";
import { EditField } from "elements/service";

export const EditProfile = () => {
  // State
  const [page, setPage] = useState<
    "name" | "password" | "email" | "photo" | "main" | "confirm_password"
  >("main");
  const [photo, setPhoto] = useState<File | null>(null);

  // Redux
  const { data: myInfoData } = useSelector(
    (state: RootState) => state.profile.myInfo
  );
  const { status, error } = useSelector(
    (state: RootState) => state.profile.changeInfo
  );
  const dispatch = useDispatch();

  if (!myInfoData) return <Loading />;

  // Initial values
  const initialValues = {
    confirmPassword: "" as string,
    email: myInfoData.email as string,
    firstName: myInfoData.firstName as string,
    lastName: myInfoData.lastName as string,
    password: "" as string,
  };

  // Validate
  const validate = (values: typeof initialValues) => {
    const { email, lastName, firstName, password, confirmPassword } = values;
    const errors: { [field: string]: string } = {};
    const re =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;

    if (!firstName) errors.firstName = "Не введено имя";
    if (!lastName) errors.lastName = "Не введена фамилия";
    if (!re.test(email.toLowerCase()))
      errors.email = "Неверный формат почтового адреса";
    if (page === "password" && password.length < 6)
      errors.password = "Слишком короткий пароль";
    if (page === "password" && password.length > 256)
      errors.password = "Слишком длинный пароль";
    if (page === "confirm_password" && confirmPassword.length < 6)
      errors.confirm_password = "Слишком короткий пароль";
    if (page === "confirm_password" && confirmPassword.length > 256)
      errors.confirm_password = "Слишком длинный пароль";
    if (firstName.length > 200) errors.firstName = "Слишком длинное имя";
    if (lastName.length > 200) errors.lastName = "Слишком длинная фамилия";

    return errors;
  };

  // Submit
  const onSubmit = async (values: typeof initialValues) => {
    const { password, firstName, lastName, email, confirmPassword } = values;
    if (
      (page !== "confirm_password" && page !== "photo") ||
      (page === "photo" && photo)
    )
      setPage("confirm_password");
    else
      await dispatch(
        changeMyInfo({
          confirmPassword,
          email,
          firstName,
          lastName,
          password: password === "" ? null : password,
          photo,
        })
      );
  };
  return (
    <div className={styles.container}>
      <PopupHeader title="Настройки" />
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
        validateOnMount={true}
      >
        <FormikForm>
          <section className={styles.main_section}>
            {page === "main" && (
              <>
                <Button
                  text="Изменить фото"
                  buttonProps={{ onClick: () => setPage("photo") }}
                />
                <Button
                  text="Изменить имя и фамилию"
                  buttonProps={{ onClick: () => setPage("name") }}
                />
                <Button
                  text="Изменить почту"
                  buttonProps={{ onClick: () => setPage("email") }}
                />
                <Button
                  text="Изменить пароль"
                  buttonProps={{ onClick: () => setPage("password") }}
                />
              </>
            )}
            {page === "name" && (
              <>
                <EditField
                  label="Измение имени и фамилии"
                  name="firstName"
                  type="text"
                  placeholder="Имя"
                />
                <EditField name="lastName" type="text" placeholder="Фамилия" />
              </>
            )}
            {page === "email" && (
              <EditField
                label="Измение почты"
                name="email"
                type="text"
                placeholder="Почта"
              />
            )}
            {page === "photo" && (
              <>
                <label className={styles.label}>
                  <h3 className={styles.label_text}>Загрузите новое фото</h3>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    onChange={(event) => {
                      if (!event.target.files) {
                        return;
                      }
                      let file = event.target.files[0];
                      setPhoto(file);
                    }}
                  />
                </label>
              </>
            )}
            {page === "password" && (
              <EditField
                label="Введите новый пароль"
                placeholder="Новый пароль"
                name="password"
                type="password"
              />
            )}
            {page === "confirm_password" && (
              <EditField
                label="Для изменения данных введите свой пароль"
                placeholder="Ваш пароль"
                name="confirmPassword"
                type="password"
              />
            )}
          </section>
          <section className={styles.bottom_section}>
            <div className={styles.errors_messages}>
              <ErrorMessage name="firstName" component="p" />
              <ErrorMessage name="email" component="p" />
              <ErrorMessage name="password" component="p" />
              <ErrorMessage name="lastName" component="p" />
              <ErrorMessage name="confirmPassword" component="p" />
              {error && <p>{error}</p>}
            </div>
            {page !== "main" && (
              <div className={styles.save_button}>
                <MainButton type="medium" buttonProps={{ type: "submit" }} loading={status === 'loading'}>
                  Сохранить изменения
                </MainButton>
              </div>
            )}
          </section>
          {page === "main" && (
            <p
              onClick={() => dispatch(unregister())}
              className={styles.logout_button}
            >
              Выйти
            </p>
          )}
        </FormikForm>
      </Formik>
    </div>
  );
};
