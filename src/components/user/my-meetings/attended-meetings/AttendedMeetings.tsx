import { UserWrapper } from "elements/ui";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getMyAttendedMeetings } from "store/meetingsSlice";
import { RootState } from "store";
import { MeetingItem } from "../meeting-item/MeetingItem";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Paginator } from "elements/service";

const AttendedMeetings = () => {
  // Current page state
  const [currentPage, setCurrentPage] = useState(0);

  // Navigate to previous page
  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from?.pathname || "/";

  // Redux
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getMyAttendedMeetings({
        size: 6,
        meetingStatus: "CREATED",
        currentPage: currentPage,
      })
    );
  }, [currentPage]);
  const { data } = useSelector(
    (state: RootState) => state.meetings.myAttendedMeetings.createdData
  );
  if (!data) return <p>Loading</p>;

  return (
    <UserWrapper>
      <>
        <div>
          <div onClick={() => navigate(fromPage, { replace: true })}>arrow</div>
          <h4>Предстоящие встречи</h4>
        </div>
        <NavLink to="/meetings/attended/finished">
          Открыть завершенные встречи
        </NavLink>
        <div>
          {data &&
            data.meetings.map((meeting) => (
              <MeetingItem meeting={meeting} status="CREATED" isMine={false} />
            ))}
        </div>
        <div>
          <Paginator
            setCurrentPage={setCurrentPage}
            totalPage={data.totalPage}
            currentPage={currentPage}
          />
        </div>
      </>
    </UserWrapper>
  );
};

export default AttendedMeetings;
