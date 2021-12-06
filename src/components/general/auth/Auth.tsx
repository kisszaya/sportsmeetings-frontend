import { AuthWrapper, MainButton } from "elements/ui";
import { Formik, Form as FormikForm, ErrorMessage } from "formik";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "store";
import { useDispatch, useSelector } from "react-redux";
import { AuthField } from "elements/service";
import { login } from "store/authSlice";
import { useEffect } from "react";

import styles from "./Auth.module.scss";
import generalStyles from "../GeneralStyles.module.scss";

import { ReactComponent as LogoSVG } from "./media/logo.svg";

const Auth = () => {
  //Redux
  const { login: loginData, userToken } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

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
    username: "" as string,
    password: "" as string,
  };

  // Validate
  const validate = (values: typeof initialValues) => {
    const { username, password } = values;
    const errors: { [field: string]: string } = {};

    if (!username) errors.username = "Не введен никнейм";
    if (!password) errors.password = "Не введен пароль";
    if (password.length < 6) errors.password = "Слишком короткий пароль";
    if (password.length > 256) errors.password = "Слишком длинный пароль";
    if (password.length > 30) errors.username = "Слишком длинный никнейм";

    return errors;
  };

  // Submit
  const onSubmit = async (values: typeof initialValues) => {
    const { username, password } = values;
    await dispatch(login({ password, username }));
    if (localStorage.getItem("x-auth-token"))
      navigate(fromPage, { replace: true });
  };

  return (
    <AuthWrapper>
      <div className={styles.container}>
        <section className={styles.landing}>
          <div className={styles.logoSVG}>
            <LogoSVG />
          </div>
          <p className={styles.app_description}>
            НАХОДИ ДРУЗЕЙ <span className={styles.and}>&</span>{" "}
            ЗАНИМАЙСЯ СПОРТОМ
          </p>
        </section>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validate={validate}
          validateOnMount={true}
        >
          <FormikForm className={styles.form_container}>
            <h4 className={generalStyles.form_title}>Войти в аккаунт</h4>
            <AuthField placeholder="Никнейм" name="username" type="text" />
            <AuthField placeholder="Пароль" name="password" type="password" />
            <div className={generalStyles.error_messages}>
              <ErrorMessage name="username" component="p" />
              <ErrorMessage name="password" component="p" />
              {loginData.error && <p>{loginData.error}</p>}
            </div>
            <div className={generalStyles.button_container}>
              <MainButton
                buttonProps={{ type: "submit" }}
                type="large"
                loading={loginData.status === "loading"}
              >
                Войти
              </MainButton>
            </div>
            <div className={generalStyles.change_page}>
              <NavLink to="/register">Нет аккаунта</NavLink>
            </div>
          </FormikForm>
        </Formik>
      </div>
    </AuthWrapper>
  );
};

export default Auth;
