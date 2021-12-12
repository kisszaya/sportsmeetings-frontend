import { UserWrapper } from "elements/ui";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMeetings, getCoordinates } from "store/meetingsSlice";
import { RootState } from "store";
import { MeetingItem } from "./meeting-item/MeetingItem";

import styles from './AllMeetings.module.scss'

const AllMeetings = () => {
  const dispatch = useDispatch();
  const { userLongitude, userLatitude, data } = useSelector(
    (state: RootState) => state.meetings.allMeetings
  );

  useEffect(() => {
    if (!userLatitude || !userLongitude) dispatch(getCoordinates());
    else dispatch(getAllMeetings());
  }, [dispatch, userLongitude, userLatitude]);

  if (!data) return <p>Loading...</p>;
  return (
    <UserWrapper>
      <div className={styles.meeting_container}>
        {data.meetings.map((meeting) => (
          <MeetingItem meeting={meeting} />
        ))}
      </div>
    </UserWrapper>
  );
};

export default AllMeetings;
