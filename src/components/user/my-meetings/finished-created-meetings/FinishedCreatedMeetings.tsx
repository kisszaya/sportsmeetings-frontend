import { UserWrapper } from "elements/ui";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getMyCreatedMeetings } from "store/meetingsSlice";
import { RootState } from "store";
import { MeetingItem } from "../meeting-item/MeetingItem";
import { NavLink } from "react-router-dom";
import { Paginator } from "elements/service";

import styles from "../MyMeetings.module.scss";

import { ReactComponent as ArrowSVG } from "../media/arrow.svg";
import { Loading } from "components/general";

const FinishedCreatedMeetings = () => {
  // Current page state
  const [currentPage, setCurrentPage] = useState(0);

  // Redux
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getMyCreatedMeetings({
        size: 6,
        meetingStatus: "FINISHED",
        currentPage: currentPage,
      })
    );
  }, [currentPage]);
  const { finishedData, error, status } = useSelector(
    (state: RootState) => state.meetings.myCreatedMeetings
  );
  if (!finishedData.data || status === "loading") return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <UserWrapper>
      <div className={styles.container}>
        <section className={styles.top_section}>
          <div className={styles.title_container}>
            <NavLink to="/profile/events" className={styles.arrowSVG}>
              <ArrowSVG />
            </NavLink>
            <h4 className={styles.title}>Законченные встречи</h4>
          </div>
          <NavLink
            to="/meetings/created"
            className={styles.finished_meetings_link}
          >
            Открыть предстоящие встречи
          </NavLink>
        </section>
        <section className={styles.data_section}>
          {finishedData.data &&
            finishedData.data.meetings.map((meeting) => (
              <MeetingItem meeting={meeting} status="FINISHED" isMine={true} />
            ))}
        </section>
        {finishedData.data.totalPage !== 1 && (
          <section className={styles.paginator}>
            <Paginator
              setCurrentPage={setCurrentPage}
              totalPage={finishedData.data.totalPage}
              currentPage={currentPage}
            />
          </section>
        )}
      </div>
    </UserWrapper>
  );
};

export default FinishedCreatedMeetings;
