import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { useEffect } from "react";
import { getMyCreatedMeetings } from "store/meetingsSlice";
import { MeetingItem } from "../meeting-item/MeetingItem";
import { Loading } from "components/general";
import { NavLink } from "react-router-dom";

export const CreatedMeetings = () => {
  const dispatch = useDispatch();
  const { createdData, finishedData, error, status } = useSelector(
    (state: RootState) => state.meetings.myCreatedMeetings
  );
  useEffect(() => {
    if (!createdData.data)
      dispatch(
        getMyCreatedMeetings({
          size: 5,
          meetingStatus: "CREATED",
          currentPage: 0,
        })
      );
    if (
      createdData.data &&
      !finishedData.data &&
      createdData.data.meetings.length < 4
    ) {
      dispatch(
        getMyCreatedMeetings({
          size: 5,
          meetingStatus: "FINISHED",
          currentPage: 0,
        })
      );
    }
  }, [dispatch, createdData]);

  if (status === "loading") return <Loading />;
  if (error) return <p>{error}</p>;
  if (!createdData.data && !finishedData.data)
    return <p>У вас еще нет встреч</p>;

  const createdLength = createdData.data?.meetings.length;
  const finishedLength = finishedData.data?.meetings.length;
  return (
    <>
      <div>
        {createdData.data?.meetings.slice(0, 4).map((meeting) => (
          <MeetingItem meeting={meeting} status="CREATED" isMine={true} />
        ))}
        {createdLength !== 5 &&
          finishedData.data?.meetings
            .slice(0, 4 - (createdLength ? createdLength : 0))
            .map((meeting) => (
              <MeetingItem meeting={meeting} status="FINISHED" isMine={true} />
            ))}
      </div>
      {(createdLength ? createdLength : 0) +
        (finishedLength ? finishedLength : 0) >
        4 && <NavLink to="/meetings/created">Открыть все встречи</NavLink>}
    </>
  );
};
