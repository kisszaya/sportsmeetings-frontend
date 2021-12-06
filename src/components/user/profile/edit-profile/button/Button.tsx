import { ButtonHTMLAttributes } from "react";

import styles from "./Button.module.scss";

import { ReactComponent as ArrowSVG } from "./arrow.svg";

type ButtonProps = {
  text: string;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
};

export const Button = (props: ButtonProps) => {
  return (
    <button {...props.buttonProps} className={styles.container}>
      <p>{props.text}</p>
      <div className={styles.arrowSVG}>
        <ArrowSVG />
      </div>
    </button>
  );
};
