import { NavLink } from "react-router-dom";
import { MeetingType } from "types/MeetingTypes";
import {
  GetCategoryName,
  GetConvertedAddress,
  GetConvertedTime,
  GetCreatorUsername,
  GetRequestsNumberByMeetingId,
} from "utils/MeetingsFunctions";

import styles from "./MeetingItem.module.scss";

export const MeetingItem = (props: {
  meeting: MeetingType;
  status: "FINISHED" | "CREATED";
  isMine: boolean;
}) => {
  const { meeting, status, isMine } = props;
  const meetingType = isMine ? "created" : "attended";

  return (
    <NavLink
      to={`/meetings/${meetingType}/${meeting.id}`}
      className={styles.container}
    >
      <section className={styles.top_section}>
        <div className={styles.placeAndTime}>
          <h3 className={styles.category}>
            <GetCategoryName categoryId={meeting.categoryId} />
          </h3>
          <p className={styles.time}>
            <GetConvertedTime text={meeting.startDate} />
          </p>
          <p className={styles.address}>
            <GetConvertedAddress
              lng={meeting.longitude}
              lat={meeting.latitude}
            />
          </p>
        </div>
        <iframe
          width="80"
          height="48"
          frameBorder="0"
          scrolling="no"
          src={`https://maps.google.com/maps?q=${meeting.latitude},${meeting.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
        />
      </section>
      <section className={styles.bottom_section}>
        <div className={styles.line} />
        <p className={styles.description}>
          {meeting.description.length > 90
            ? `${meeting.description.length}...`
            : meeting.description}
        </p>
        <div className={styles.buttons_container}>
          {!isMine && (
            <div className={styles.creator_button}>
              <GetCreatorUsername meeting={meeting} />
            </div>
          )}
          {isMine && <div className={styles.my_button}>Ваша встреча</div>}
          {status === "FINISHED" && (
            <div className={styles.finished_button}>Завершена</div>
          )}
          {status === "CREATED" && isMine && (
            <div className={styles.requests_button}>
              <GetRequestsNumberByMeetingId meetingId={meeting.id} />
            </div>
          )}
        </div>
      </section>
    </NavLink>
  );
};
