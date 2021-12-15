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
import { Loading } from "components/general";

import styles from "./MeetingsPage.module.scss";

import { ReactComponent as TimeSVG } from "./media/time.svg";
import { ReactComponent as PlaceSVG } from "./media/place.svg";

const MeetingPageContainer = () => {
  let { id: meetingId, meetingType } = useParams();

  // Redux
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
          <object type="owo/uwu" className={styles.img}>
            <a
              href={`http://maps.google.com/maps?q=${data.latitude},${data.longitude}`}
              target="_blank"
            >
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${data.latitude},${data.longitude}&zoom=12&size=300x300&markers=color:red%7C${data.latitude},${data.longitude}&key=AIzaSyBB8NX_l1PeFmiGqs8unnV88wjs_MW1J9k`}
                alt="Map"
              />
            </a>
          </object>
          <h3 className={styles.name}>
            <GetCategoryName categoryId={data.categoryId} />
          </h3>
          <div className={styles.time_place_container}>
            <div>
              <TimeSVG />
            </div>
            <p className={styles.time}>
              <GetConvertedTime text={data.startDate} />
            </p>
          </div>
          <div className={styles.time_place_container}>
            <div>
              <PlaceSVG />
            </div>
            <p className={styles.address}>
              <GetConvertedAddress lat={data.latitude} lng={data.longitude} />
            </p>
          </div>
          <div className={styles.line} />
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
