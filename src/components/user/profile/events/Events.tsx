import ProfileContainer from "../ProfileContainer";

import { CreatedMeetings } from "./created/CreatedMeetings";
import { AttendedMeetings } from "./attended/AttendedMeetings";

const Events = () => {
  return (
    <ProfileContainer>
      <div>
        <h5>Мои встречи</h5>
        <CreatedMeetings />
      </div>
      <div>
        <h5>Все встречи</h5>
        <AttendedMeetings />
      </div>
    </ProfileContainer>
  );
};

export default Events;
