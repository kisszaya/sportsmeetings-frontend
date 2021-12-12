import { useContext } from "react";
import { PopupContext } from "elements/service";
import { ModalMeeting } from "../../modal-meeting/ModalMeeting";
import {
  GetCategoryName,
  GetConvertedAddress,
  GetConvertedTime,
  GetCreatorUsername,
} from "utils/MeetingsFunctions";
import { MeetingType } from "types/MeetingTypes";

import styles from "./MeetingItem.module.scss";

export const MeetingItem = (props: { meeting: MeetingType }) => {
  const setPopup = useContext(PopupContext);

  return (
    <div className={styles.container}>
      <section className={styles.top_section}>
        <div className={styles.info}>
          <h3 className={styles.category}>
            <GetCategoryName categoryId={props.meeting.categoryId} />
          </h3>
          <p className={styles.time}>
            <GetConvertedTime text={props.meeting.startDate} />
          </p>
          <p className={styles.address}>
            <GetConvertedAddress
              lat={props.meeting.latitude}
              lng={props.meeting.longitude}
            />
          </p>
        </div>
        <iframe
          width="150"
          height="96"
          frameBorder="0"
          scrolling="no"
          src={`https://maps.google.com/maps?q=${props.meeting.latitude},${props.meeting.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
        />
      </section>
      <div className={styles.line} />
      <section className={styles.description_section}>
        <p className={styles.nickname}>
          <GetCreatorUsername meeting={props.meeting} />
        </p>
        <p className={styles.description}>{props.meeting.description}</p>
      </section>
      <section className={styles.bottom_section}>
        <div className={styles.participants}>
          <p className={styles.max_number_of_participants}>
            {`${props.meeting.maxNumbOfParticipants} всего`}
          </p>
          <p className={styles.number_of_participants}>
            {`${props.meeting.participantsIds.length} мест`}
          </p>
        </div>
        <button
          className={styles.button}
          onClick={() => setPopup(<ModalMeeting meeting={props.meeting} />)}
        >
          Открыть
        </button>
      </section>
    </div>
  );
};
