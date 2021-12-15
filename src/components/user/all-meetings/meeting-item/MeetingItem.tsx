import { useContext } from "react";
import { PopupContext } from "elements/service";
import { ModalMeeting } from "../../modal-meeting/ModalMeeting";
import {
  GetCategoryName,
  GetConvertedAddress,
  GetConvertedTime,
  GetCreatorUsername,
} from "utils/MeetingsFunctions";
import { PlacesText } from "utils/EndingsFunctions";
import { MeetingType } from "types/MeetingTypes";

import styles from "./MeetingItem.module.scss";

import { ReactComponent as PlaceSVG } from "../media/place.svg";
import { ReactComponent as TimeSVG } from "../media/time.svg";

export const MeetingItem = (props: { meeting: MeetingType }) => {
  // Popup
  const setPopup = useContext(PopupContext);

  return (
    <div className={styles.container}>
      <section className={styles.top_section}>
        <div className={styles.info}>
          <h3 className={styles.category}>
            <GetCategoryName categoryId={props.meeting.categoryId} />
          </h3>
          <div className={styles.time_place_container}>
            <div>
              <TimeSVG />
            </div>
            <p className={styles.time}>
              <GetConvertedTime text={props.meeting.startDate} />
            </p>
          </div>
          <div className={styles.time_place_container}>
            <div>
              <PlaceSVG />
            </div>
            <p className={styles.address}>
              <GetConvertedAddress
                lat={props.meeting.latitude}
                lng={props.meeting.longitude}
              />
            </p>
          </div>
        </div>
        <a
          href={`http://maps.google.com/maps?q=${props.meeting.latitude},${props.meeting.longitude}`}
          target="_blank"
          className={styles.img}
        >
          <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${props.meeting.latitude},${props.meeting.longitude}&zoom=12&size=150x150&markers=color:red%7C${props.meeting.latitude},${props.meeting.longitude}&key=AIzaSyBB8NX_l1PeFmiGqs8unnV88wjs_MW1J9k`}
            alt="Map"
          />
        </a>
      </section>
      <div className={styles.line} />
      <section className={styles.description_section}>
        <p className={styles.nickname}>
          <GetCreatorUsername meeting={props.meeting} />
        </p>
        <p className={styles.description}>
          {props.meeting.description.length > 120
            ? `${props.meeting.description.substring(0, 120)}...`
            : props.meeting.description}
        </p>
      </section>
      <section className={styles.bottom_section}>
        <div className={styles.participants}>
          <h5 className={styles.max_number_of_participants}>
            {`${props.meeting.maxNumbOfParticipants} всего`}
          </h5>
          <h5 className={styles.number_of_participants}>
            {PlacesText(
              props.meeting.participantsIds.length,
              props.meeting.maxNumbOfParticipants
            )}
          </h5>
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
