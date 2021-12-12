import { NavLink } from "react-router-dom";
import { GetUsernameById } from "utils/MeetingsFunctions";
import { useSelector } from "react-redux";
import { RootState } from "store";

import generalStyles from "../MeetingsPage.module.scss";

export const AttendedMeeting = (props: { participantsIds: number[] }) => {
  const { data: myInfo } = useSelector(
    (state: RootState) => state.profile.myInfo
  );
  if (!myInfo) return <p>LoadingMyInfo</p>;

  return (
    <>
      <p className={generalStyles.title}>Участники</p>
      <div className={generalStyles.people_block}>
        {props.participantsIds.map((participant) => (
          <>
            {participant !== myInfo.id && (
              <NavLink
                to={`/user/${participant}`}
                className={generalStyles.participant_item}
              >
                <GetUsernameById userId={participant} />
              </NavLink>
            )}
            {participant === myInfo.id && (
              <NavLink
                to="/profile/events"
                className={generalStyles.participant_item}
              >
                <GetUsernameById userId={participant} />
              </NavLink>
            )}
          </>
        ))}
      </div>
    </>
  );
};
