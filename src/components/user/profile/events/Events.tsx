import ProfileContainer from "../ProfileContainer";
import { CreatedMeetings } from "./created/CreatedMeetings";
import { AttendedMeetings } from "./attended/AttendedMeetings";

import styles from './Events.module.scss'

const Events = () => {
  return (
    <ProfileContainer>
      <div className={styles.container}>
        <h5 className={styles.title}>Мои встречи</h5>
        <CreatedMeetings />
      </div>
      <div className={styles.container}>
        <h5 className={styles.title}>Все встречи</h5>
        <AttendedMeetings />
      </div>
    </ProfileContainer>
  );
};

export default Events;
