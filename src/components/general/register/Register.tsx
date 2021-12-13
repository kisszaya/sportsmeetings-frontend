import { AuthWrapper, MainButton } from "elements/ui";
import { Formik, Form as FormikForm, ErrorMessage } from "formik";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "store/authSlice";
import { AuthField } from "elements/service";
import { RootState } from "store";
import { useEffect } from "react";

import styles from "./Register.module.scss";
import generalStyles from "../GeneralStyles.module.scss";

const Register = () => {
  // Redux
  const dispatch = useDispatch();
  const { register: registerData, userToken } = useSelector(
    (state: RootState) => state.auth
  );

  // Navigate after submit
  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from?.pathname || "/";

  // If token, redirect to account
  useEffect(() => {
    if (userToken) navigate(fromPage, { replace: true });
  }, [fromPage, navigate, userToken]);

  // Initial values
  const initialValues = {
    firstName: "" as string,
    lastName: "" as string,
    email: "" as string,
    username: "" as string,
    password: "" as string,
  };

  // Validate
  const validate = (values: typeof initialValues) => {
    const { firstName, lastName, email, username, password } = values;
    const errors: { [field: string]: string } = {};
    const re =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;

    if (!firstName) errors.firstName = "Не введено имя";
    if (!lastName) errors.lastName = "Не введена фамилия";
    if (!re.test(email.toLowerCase()))
      errors.email = "Неверный формат почтового адреса";
    if (!username) errors.username = "Не введен никнейм";
    if (!password) errors.password = "Не введен пароль";
    if (password.length < 6) errors.password = "Слишком короткий пароль";
    if (password.length > 256) errors.password = "Слишком длинный пароль";
    if (username.length > 30) errors.username = "Слишком длинный пароль";
    if (firstName.length > 200) errors.firstName = "Слишком длинное имя";
    if (lastName.length > 200) errors.lastName = "Слишком длинная фамилия";

    return errors;
  };

  // Submit
  const onSubmit = async (values: typeof initialValues) => {
    const { firstName, lastName, email, username, password } = values;
    await dispatch(
      register({ email, firstName, lastName, password, username })
    );
    if (localStorage.getItem("x-auth-token"))
      navigate(fromPage, { replace: true });
  };

  return (
    <AuthWrapper>
      <div className={styles.container}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validate={validate}
          validateOnMount={true}
        >
          <FormikForm className={styles.form_container}>
            <h4 className={generalStyles.form_title}>Войти в аккаунт</h4>
            <AuthField placeholder="Имя" name="firstName" type="text" />
            <AuthField placeholder="Фамилия" name="lastName" type="text" />
            <AuthField placeholder="Почта" name="email" type="text" />
            <AuthField placeholder="Накнейм" name="username" type="text" />
            <AuthField placeholder="Пароль" name="password" type="password" />
            <div className={generalStyles.error_messages}>
              <ErrorMessage name="firstName" component="p" />
              <ErrorMessage name="lastName" component="p" />
              <ErrorMessage name="email" component="p" />
              <ErrorMessage name="username" component="p" />
              <ErrorMessage name="password" component="p" />
              {registerData.error && <p>{registerData.error}</p>}
            </div>
            <div className={generalStyles.button_container}>
              <MainButton
                buttonProps={{ type: "submit" }}
                type="large"
                loading={registerData.status === "loading"}
              >
                Зарегистрироваться
              </MainButton>
            </div>
            <div className={generalStyles.change_page}>
              <NavLink to="/auth">Уже есть аккаунт</NavLink>
            </div>
          </FormikForm>
        </Formik>
      </div>
    </AuthWrapper>
  );
};

export default Register;
