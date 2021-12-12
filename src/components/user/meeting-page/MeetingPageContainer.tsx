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
import { Loading } from "../../general";

import styles from './MeetingsPage.module.scss'

const MeetingPageContainer = () => {
  let { id: meetingId, meetingType } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMeetingById(Number(meetingId)));
  }, [dispatch, meetingId]);
  const { data, status, error } = useSelector(
    (state: RootState) => state.meetings.meetingById
  );

  if (error) return <p>{error}</p>;
  if (!data || status === "loading") return <Loading />;

  return (
    <UserWrapper>
      <div className={styles.container}>
      <section className={styles.left_section}>
        <iframe
          width="100%"
          height="96"
          frameBorder="0"
          scrolling="no"
          src={`https://maps.google.com/maps?q=${data.latitude},${data.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
        />
        <h3 className={styles.name}>
          <GetCategoryName categoryId={data.categoryId} />
        </h3>
        <p className={styles.time}>
          <GetConvertedTime text={data.startDate} />
        </p>
        <p className={styles.address}>
          <GetConvertedAddress lat={data.latitude} lng={data.longitude} />
        </p>
        <div className={styles.line}/>
        <p className={styles.description}> {data.description}</p>
      </section>
      <section className={styles.right_section}>
        {meetingType === "created" && (
          <CreatedMeeting
            participantsIds={data.participantsIds}
            meetingId={data.id}
          />
        )}
        {meetingType === "attended" && (
          <AttendedMeeting participantsIds={data.participantsIds} />
        )}
      </section>
      </div>
    </UserWrapper>
  );
};

export default MeetingPageContainer;
