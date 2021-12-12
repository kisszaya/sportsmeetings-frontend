import { useSelector } from "react-redux";
import { RootState } from "store";
import { NavLink } from "react-router-dom";
import classNames from "classnames";

import styles from "./Button.module.scss";

export const Button = (props: {
  participants: number[];
  creatorId: number;
  meetingId: number;
  setComment: (value: boolean) => void;
  comment: boolean;
}) => {
  const { data: myInfo } = useSelector(
    (state: RootState) => state.profile.myInfo
  );
  const { status, error } = useSelector(
    (state: RootState) => state.meetingRequests
  );

  // Creator
  if (myInfo && myInfo.id === props.creatorId)
    return (
      <NavLink to={`/meetings/created/${props.meetingId}`}>
        <div className={classNames(styles.container, styles.resolved)}>
          Ваша встреча
        </div>
      </NavLink>
    );
  // Participant
  else if (myInfo && props.participants.includes(myInfo.id))
    return (
      <div className={classNames(styles.container, styles.resolved)}>
        Вы участвуете
      </div>
    );
  // Other
  else {
    console.log("status", status);
    return (
      <>
        {status === "idle" && props.comment && (
          <button
            type="submit"
            className={classNames(styles.container, styles.idle)}
          >
            Записаться
          </button>
        )}
        {status === "idle" && !props.comment && (
          <button
            onClick={() => props.setComment(true)}
            className={classNames(styles.container, styles.idle)}
          >
            Записаться
          </button>
        )}
        {status === "loading" && (
          <div className={classNames(styles.container, styles.loading)}>
            Загрузка
          </div>
        )}
        {status === "resolved" && (
          <div className={classNames(styles.container, styles.resolved)}>
            Вы записаны
          </div>
        )}
        {status === "rejected" && (
          <div className={classNames(styles.container, styles.rejected)}>
            {error}
          </div>
        )}
      </>
    );
  }
};
