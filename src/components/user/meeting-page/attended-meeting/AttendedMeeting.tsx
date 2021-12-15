import { NavLink } from "react-router-dom";
import { GetUsernameById } from "utils/MeetingsFunctions";
import { useSelector } from "react-redux";
import { RootState } from "store";

import generalStyles from "../MeetingsPage.module.scss";
import {Loading} from "components/general";

export const AttendedMeeting = (props: { participantsIds: number[] }) => {
  const { data: myInfo } = useSelector(
    (state: RootState) => state.profile.myInfo
  );
  if (!myInfo) return <Loading/>;

  return (
    <>
      <p className={generalStyles.title}>Участники</p>
      <div className={generalStyles.people_block}>
        {props.participantsIds.map((participant, index) => (
          <>
            {participant !== myInfo.id && (
              <NavLink key={index}
                to={`/user/${participant}`}
                className={generalStyles.participant_item}
              >
                <GetUsernameById userId={participant} />
              </NavLink>
            )}
            {participant === myInfo.id && (
              <NavLink key={index}
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
