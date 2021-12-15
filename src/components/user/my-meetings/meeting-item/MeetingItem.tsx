import { MeetingType } from "types/MeetingTypes";
import {
  GetCategoryName,
  GetConvertedAddress,
  GetConvertedTime,
  GetCreatorUsername,
  GetRequestsNumberByMeetingId,
} from "utils/MeetingsFunctions";

import styles from "./MeetingItem.module.scss";

import { ReactComponent as PlaceSVG } from "../media/place.svg";
import { ReactComponent as TimeSVG } from "../media/time.svg";

export const MeetingItem = (props: {
  meeting: MeetingType;
  status: "FINISHED" | "CREATED";
  isMine: boolean;
}) => {
  const { meeting, status, isMine } = props;
  const meetingType = isMine ? "created" : "attended";

  return (
    <a
      href={`/meetings/${meetingType}/${meeting.id}`}
      className={styles.container}
    >
      <section className={styles.top_section}>
        <div className={styles.placeAndTime}>
          <h3 className={styles.category}>
            <GetCategoryName categoryId={meeting.categoryId} />
          </h3>
          <div className={styles.time_container}>
            <div>
              <TimeSVG />
            </div>
            <p className={styles.time}>
              <GetConvertedTime text={meeting.startDate} />
            </p>
          </div>
          <div className={styles.address_container}>
            <div>
              <PlaceSVG />
            </div>
            <p className={styles.address}>
              <GetConvertedAddress
                lng={meeting.longitude}
                lat={meeting.latitude}
              />
            </p>
          </div>
        </div>
        <object type="owo/uwu" className={styles.img}>
          <a
            href={`http://maps.google.com/maps?q=${meeting.latitude},${meeting.longitude}`}
            target="_blank"
          >
            <img
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${meeting.latitude},${meeting.longitude}&zoom=12&size=100x80&markers=color:red%7C${meeting.latitude},${meeting.longitude}&key=AIzaSyBB8NX_l1PeFmiGqs8unnV88wjs_MW1J9k`}
              alt="Map"
            />
          </a>
        </object>
      </section>
      <section className={styles.bottom_section}>
        <div className={styles.line} />
        <p className={styles.description}>
          {meeting.description.length > 60
            ? `${meeting.description.substring(0, 60)}...`
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
    </a>
  );
};
