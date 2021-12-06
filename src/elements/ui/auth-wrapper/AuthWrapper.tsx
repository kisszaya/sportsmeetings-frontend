import { HTMLAttributes, ReactChild } from "react";
import { Wrapper } from "elements/ui";

import styles from "./AuthWrapper.module.scss";

interface WrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactChild | ReactChild[];
}

export const AuthWrapper = (props: WrapperProps) => {
  return (
    <div className={styles.background}>
      <Wrapper>{props.children}</Wrapper>
    </div>
  );
};
