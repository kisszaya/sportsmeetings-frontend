import { Field as FormikField } from "formik";

import styles from "./EditField.module.scss";

export const EditField = (props: {
  placeholder?: string;
  name: string;
  type?: string;
  label?: string;
}) => {
  const { ...inputProps } = props;
  return (
    <label className={styles.label}>
      {props.label && <h3 className={styles.label_text}>{props.label}</h3>}
      <FormikField {...inputProps} />
    </label>
  );
}
