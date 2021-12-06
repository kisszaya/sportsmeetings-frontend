import { Field as FormikField } from "formik";
import { ReactChild } from "react";

import styles from './MeetingFieldSelect.module.scss'

export const MeetingFieldSelect = (props: {
  placeholder?: string;
  name: string;
  children: ReactChild | ReactChild[];
}) => {
  const { children, ...inputProps } = props;
  return (
    <label className={styles.label}>
      <FormikField as="select" {...inputProps}>
        {children}
      </FormikField>
    </label>
  );
};
