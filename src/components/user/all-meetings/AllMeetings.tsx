import { UserWrapper } from "elements/ui";
import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMeetings, getCoordinates } from "store/meetingsSlice";
import { RootState } from "store";
import { MeetingItem } from "./meeting-item/MeetingItem";
import { Categories } from "./categories/Categories";
import { Loading } from "components/general";
import { Distance } from "./distance/Distance";

import styles from "./AllMeetings.module.scss";

const AllMeetings: FC = () => {
  // State
  const [currentPage, setCurrentPage] = useState(0);
  const [distanceInKilometers, setDistanceInKilometers] = useState(10000);
  const [categoryIds, setCategoryIds] = useState<null | number[]>(null);
  const [fetching, setFetching] = useState(true);

  // Redux
  const dispatch = useDispatch();
  const { userLongitude, userLatitude, data, totalPage, status, error } =
    useSelector((state: RootState) => state.meetings.allMeetings);

  // Get user coordinates, then get all meetings
  useEffect(() => {
    if (!userLatitude || !userLongitude) dispatch(getCoordinates());
    else if (fetching && currentPage < totalPage) {
      dispatch(
        getAllMeetings({
          categoryIds: categoryIds,
          currentPage: currentPage,
          distanceInKilometers: distanceInKilometers,
        })
      );
      setCurrentPage((prevState) => prevState + 1);
    }
    setFetching(false);
  }, [fetching, dispatch, userLongitude, userLatitude]);

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return function () {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const scrollHandler = useCallback(() => {
    if (
      document.documentElement.scrollHeight -
        (document.documentElement.scrollTop + window.innerHeight) <
      100
    ) {
      setFetching(true);
    }
  }, []);

  return (
    <UserWrapper>
      <div className={styles.container}>
        <div className={styles.filter_container}>
          <Categories
            setCategoryIds={setCategoryIds}
            categoryIds={categoryIds}
            setCurrentPage={setCurrentPage}
            setFetching={setFetching}
          />
          <Distance
            setDistanceInKilometers={setDistanceInKilometers}
            distanceInKilometers={distanceInKilometers}
            setCurrentPage={setCurrentPage}
            setFetching={setFetching}
          />
        </div>
        {error && <p>{error}</p>}
        {
          data?.length === 0 && <p>Встреч не найдено</p>
        }
        {!data && <Loading />}
        {data && (
          <div className={styles.meetings_container}>
            {data.map((meeting) => (
              <MeetingItem meeting={meeting} />
            ))}
          </div>
        )}
      </div>
    </UserWrapper>
  );
};

export default AllMeetings;
