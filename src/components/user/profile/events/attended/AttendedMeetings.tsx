import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { useEffect } from "react";
import { getMyAttendedMeetings } from "store/meetingsSlice";
import { MeetingItem } from "../meeting-item/MeetingItem";
import { Loading } from "components/general";
import { NavLink } from "react-router-dom";

export const AttendedMeetings = () => {
  const dispatch = useDispatch();
  const { createdData, finishedData, error, status } = useSelector(
    (state: RootState) => state.meetings.myAttendedMeetings
  );
  useEffect(() => {
    if (!createdData.data)
      dispatch(
        getMyAttendedMeetings({
          size: 4,
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
        getMyAttendedMeetings({
          size: 5,
          meetingStatus: "FINISHED",
          currentPage: 0,
        })
      );
    }
  }, [dispatch, createdData]);

  if (status === "loading") return <Loading />;
  if (error) return <p>{error}</p>;
  if (!createdData.data && !finishedData) return <p>У вас еще нет встреч</p>;

  const createdLength = createdData.data?.meetings.length;
  const finishedLength = finishedData.data?.meetings.length;

  return (
    <>
      <div>
        {createdData.data?.meetings.slice(0, 4).map((meeting) => (
          <MeetingItem meeting={meeting} status="CREATED" isMine={false} />
        ))}
        {createdLength !== 5 &&
          finishedData.data?.meetings
            .slice(0, 4 - (createdLength ? createdLength : 0))
            .map((meeting) => (
              <MeetingItem meeting={meeting} status="FINISHED" isMine={false} />
            ))}
      </div>
      {(createdLength ? createdLength : 0) +
        (finishedLength ? finishedLength : 0) >
        4 && <NavLink to="/meetings/attended">Открыть все встречи</NavLink>}
    </>
  );
};