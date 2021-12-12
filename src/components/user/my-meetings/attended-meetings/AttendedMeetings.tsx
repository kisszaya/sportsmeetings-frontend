import { UserWrapper } from "elements/ui";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getMyAttendedMeetings } from "store/meetingsSlice";
import { RootState } from "store";
import { MeetingItem } from "../meeting-item/MeetingItem";
import { NavLink } from "react-router-dom";
import { Paginator } from "elements/service";

import styles from "../MyMeetings.module.scss";

import { ReactComponent as ArrowSVG } from "../media/arrow.svg";
import { Loading } from "components/general";

const AttendedMeetings = () => {
  // Current page state
  const [currentPage, setCurrentPage] = useState(0);

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
  const { createdData, error, status } = useSelector(
    (state: RootState) => state.meetings.myAttendedMeetings
  );
  if (!createdData.data || status === "loading") return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <UserWrapper>
      <div className={styles.container}>
        <section className={styles.top_section}>
          <div className={styles.title_container}>
            <NavLink to="/profile/events" className={styles.arrowSVG}>
              <ArrowSVG />
            </NavLink>
            <h4 className={styles.title}>Предстоящие встречи</h4>
          </div>
          <NavLink
            to="/meetings/attended/finished"
            className={styles.finished_meetings_link}
          >
            Открыть завершенные встречи
          </NavLink>
        </section>
        <section className={styles.data_section}>
          {createdData.data &&
            createdData.data.meetings.map((meeting) => (
              <MeetingItem meeting={meeting} status="CREATED" isMine={false} />
            ))}
        </section>
        {createdData.data.totalPage !== 1 && (
            <section className={styles.paginator}>
              <Paginator
                  setCurrentPage={setCurrentPage}
                  totalPage={createdData.data.totalPage}
                  currentPage={currentPage}
              />
            </section>
        )}
      </div>
    </UserWrapper>
  );
};

export default AttendedMeetings;
