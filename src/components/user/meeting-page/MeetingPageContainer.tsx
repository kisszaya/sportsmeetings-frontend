import { useEffect } from "react";
import { UserWrapper } from "elements/ui";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMeetingById } from "store/meetingsSlice";
import { RootState } from "store";
import {
  GetCategoryName,
  GetConvertedAddress,
  GetConvertedTime,
} from "utils/MeetingsFunctions";
import { CreatedMeeting } from "./created-meeting/CreatedMeeting";
import { AttendedMeeting } from "./attended-meeting/AttendedMeeting";

const MeetingPageContainer = () => {
  let { id: meetingId, meetingType } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMeetingById(Number(meetingId)));
  }, [dispatch, meetingId]);
  const { meetingById } = useSelector((state: RootState) => state.meetings);

  if (!meetingById) return <p>Loading</p>;
  return (
    <UserWrapper>
      <section>
        <iframe
          width="300"
          height="170"
          frameBorder="0"
          scrolling="no"
          src={`https://maps.google.com/maps?q=${meetingById.latitude},${meetingById.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
        />
        <h3>
          <GetCategoryName categoryId={meetingById.categoryId} />
        </h3>
        <p>
          <GetConvertedTime text={meetingById.startDate} />
        </p>
        <p>
          <GetConvertedAddress
            lat={meetingById.latitude}
            lng={meetingById.longitude}
          />
        </p>
        <p> {meetingById.description}</p>
      </section>
      <section>
        {meetingType === "created" && (
          <CreatedMeeting
            participantsIds={meetingById.participantsIds}
            meetingId={meetingById.id}
          />
        )}
        {meetingType === "attended" && (
          <AttendedMeeting participantsIds={meetingById.participantsIds} />
        )}
      </section>
    </UserWrapper>
  );
};

export default MeetingPageContainer;
