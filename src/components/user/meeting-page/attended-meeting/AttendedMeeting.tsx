import { useParams } from "react-router-dom";
import { GetUsernameById } from "utils/MeetingsFunctions";

export const AttendedMeeting = (props: { participantsIds: number[] }) => {
  let { id } = useParams();

  return (
    <div>
      <p>Участники</p>
      <div>
        {props.participantsIds.map((participant) => (
          <div>
            <GetUsernameById userId={participant} />
          </div>
        ))}
      </div>
    </div>
  );
};
