import { HTMLAttributes, ReactChild } from "react";
import { Navbar } from "elements/service";
import { Wrapper } from "elements/ui";

import styles from "./UserWrapper.module.scss";

import { ReactComponent as LogoSVG } from "./media/logo.svg";

interface WrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactChild | ReactChild[];
}

export const UserWrapper = (props: WrapperProps) => {
  return (
    <div className={styles.background}>
      <Wrapper>
        <div className={styles.logo}>
          <LogoSVG />
        </div>
        <div className={styles.container}>
          <div className={styles.navbar}>
            <Navbar />
          </div>
          <div className={styles.main_container}>{props.children}</div>
        </div>
      </Wrapper>
    </div>
  );
};
