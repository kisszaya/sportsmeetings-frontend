import { Field as FormikField } from "formik";

import styles from './MeetingField.module.scss'

export const MeetingField = (props: {
  placeholder: string;
  name: string;
  type?: string;
  component?: string;
}) => {
  const { ...inputProps } = props;
  return (
    <label className={styles.label}>
      <FormikField {...inputProps} />
    </label>
  );
};
