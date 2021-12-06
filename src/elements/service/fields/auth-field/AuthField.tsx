import { Field as FormikField } from "formik";

import styles from "./AuthField.module.scss";

export const AuthField = (props: {
  placeholder: string;
  name: string;
  type?: string;
}) => {
  const { ...inputProps } = props;
  return (
    <label className={styles.label}>
      <FormikField {...inputProps} />
    </label>
  );
};
