import { ButtonHTMLAttributes, ReactChild } from "react";
import classNames from "classnames";

import styles from "./MainButton.module.scss";

import { ReactComponent as SpinSVG } from "./spin.svg";

type ButtonProps = {
  loading?: boolean;
  disabled?: boolean;
  type: "medium" | "large";
  children: ReactChild | ReactChild[];
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
};

export const MainButton = (props: ButtonProps) => {
  const { disabled, loading, buttonProps } = props;

  return (
    <button
      {...buttonProps}
      disabled={disabled}
      className={classNames(styles.container, styles[props.type], {
        [styles.loading]: loading,
      })}
    >
      {!loading && props.children}
      {loading && (
        <div className={styles.spinSVG}>
          <SpinSVG />
        </div>
      )}
    </button>
  );
};
