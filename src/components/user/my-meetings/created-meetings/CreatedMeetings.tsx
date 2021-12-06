import { UserWrapper } from "elements/ui";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { getMyCreatedMeetings } from "store/meetingsSlice";
import { useEffect, useState } from "react";
import {
  GetCategoryName,
  GetConvertedAddress,
  GetConvertedTime,
  GetCreatorUsername,
} from "utils/MeetingsFunctions";
import { NavLink } from "react-router-dom";

import styles from "./CreatedMeetings.module.scss";
import { Loading } from "../../../general";

const CreatedMeetings = () => {
  // Current Page
  const [currentPage, setCurrentPage] = useState(0);

  // Redux
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getMyCreatedMeetings({
        size: 6,
        meetingStatus: "CREATED",
        currentPage: currentPage,
      })
    );
  }, [dispatch, currentPage]);
  const { createdData, status, error } = useSelector(
    (state: RootState) => state.meetings.myCreatedMeetings
  );
  if (status === "loading") return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <UserWrapper>
      <div>
        {createdData &&
          createdData.data?.meetings.map((meeting, key) => (
            <NavLink
              to={`/meetings/created/${meeting.id}`}
              className={styles.itemContainer}
            >
              <section className={styles.top}>
                <h3>
                  <GetCategoryName categoryId={meeting.categoryId} />
                </h3>
                <div className={styles.placeAndTime}>
                  <p>
                    <GetConvertedTime text={meeting.startDate} />
                  </p>
                  <p>
                    <GetConvertedAddress
                      lng={meeting.longitude}
                      lat={meeting.latitude}
                    />
                  </p>
                  <iframe
                    width="300"
                    height="170"
                    frameBorder="0"
                    scrolling="no"
                    src={`https://maps.google.com/maps?q=${meeting.latitude},${meeting.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  />
                </div>
              </section>
              <section className={styles.bottom}>
                <p>{meeting.description}</p>
                <div className={styles.buttons}>
                  <p>
                    <GetCreatorUsername meeting={meeting} />
                  </p>
                </div>
              </section>
            </NavLink>
          ))}
      </div>
    </UserWrapper>
  );
};

export default CreatedMeetings;
