import { PropsWithChildren } from "react";
import { Loading } from "components/general";

import styles from "./ResponsePopup.module.scss";

import { ReactComponent as RejectSVG } from "./media/reject.svg";
import { ReactComponent as AcceptSVG } from "./media/accept.svg";

type ResponsePopupProps = {
  responseResult: "resolved" | "rejected" | "idle" | "loading";
  responseTexts: {
    resolved: string;
    rejected: string;
  };
};

export const ResponsePopup = (props: PropsWithChildren<ResponsePopupProps>) => {
  if (props.responseResult === "idle") {
    return <>{props.children}</>;
  } else if (props.responseResult === "resolved") {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div>
            <AcceptSVG />
          </div>
          <h3 className={styles.text}>{props.responseTexts.resolved}</h3>
        </div>
      </div>
    );
  } else if (props.responseResult === "rejected")
    return (
      <div className={styles.container}>
        <div>
          <RejectSVG />
        </div>
        <h3 className={styles.text}>{props.responseTexts.rejected}</h3>
      </div>
    );
  else return <Loading />;
};
