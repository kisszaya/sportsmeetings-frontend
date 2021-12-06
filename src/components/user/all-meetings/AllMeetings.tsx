import { UserWrapper } from "elements/ui";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMeetings, getCoordinates } from "store/meetingsSlice";
import { RootState } from "store";
import {
  GetCategoryName,
  GetConvertedAddress,
  GetConvertedTime, GetCreatorUsername,
  GetUsernameById,
} from "utils/MeetingsFunctions";
import { PopupContext } from "elements/service";
import {ModalMeeting} from "../modal-meeting/ModalMeeting";

const AllMeetings = () => {
  const dispatch = useDispatch();
  const { userLongitude, userLatitude, data } = useSelector(
    (state: RootState) => state.meetings.allMeetings
  );

  useEffect(() => {
    if (!userLatitude || !userLongitude) dispatch(getCoordinates());
    else dispatch(getAllMeetings());
  }, [dispatch, userLongitude, userLatitude]);

  const setPopup = useContext(PopupContext)

  if (!data) return <p>Loading...</p>;
  return (
    <UserWrapper>
      <>
        {data.meetings.map((meeting) => (
          <div onClick={() => setPopup(<ModalMeeting meeting={meeting}/>)}>
            <section>
              <div>
                <GetCategoryName categoryId={meeting.categoryId} />
                <p>
                  <GetConvertedTime text={meeting.startDate} />
                </p>
                <p>
                  <GetConvertedAddress
                    lat={meeting.latitude}
                    lng={meeting.longitude}
                  />
                </p>
              </div>
              <iframe
                width="300"
                height="170"
                frameBorder="0"
                scrolling="no"
                src={`https://maps.google.com/maps?q=${meeting.latitude},${meeting.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              />
            </section>
            <section>
              <p>
                <GetCreatorUsername meeting={meeting} />
              </p>
              <p>{meeting.description}</p>
              <p>{meeting.maxNumbOfParticipants}</p>
              <p>{meeting.participantsIds.length}</p>
            </section>
          </div>
        ))}
      </>
    </UserWrapper>
  );
};

export default AllMeetings;
