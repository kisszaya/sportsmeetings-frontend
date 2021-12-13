import { useDispatch, useSelector } from "react-redux";
import { getRequestsByMeetingId } from "store/meetingsSlice";
import { RootState } from "store";
import { useEffect } from "react";
import { GetUsernameById } from "utils/MeetingsFunctions";
import {
  updateParticipantInMeeting,
  updateRequestStatus,
} from "store/meetingRequestsSlice";

import generalStyles from "../MeetingsPage.module.scss";
import styles from "./CreatedMeeting.module.scss";
import { NavLink } from "react-router-dom";

import { ReactComponent as AcceptSVG } from "../media/accept.svg";
import { ReactComponent as RejectSVG } from "../media/reject.svg";
import { Loading } from "components/general";

export const CreatedMeeting = (props: {
  participantsIds: number[];
  meetingId: number;
}) => {
  // Redux
  const dispatch = useDispatch();
  const { data: requestsData } = useSelector(
    (state: RootState) => state.meetings.myCreatedMeetings.requests
  );
  useEffect(() => {
    if (!requestsData.find((meeting) => meeting.meetingId === props.meetingId))
      dispatch(getRequestsByMeetingId(Number(props.meetingId)));
  }, [dispatch, props.meetingId, requestsData]);

  const { data: myInfo } = useSelector(
    (state: RootState) => state.profile.myInfo
  );

  //
  //   useEffect(() => {dispatch(getRequestsByMeetingId(meetingId))}, []);


    // If not loaded
  if (!requestsData.find((meeting) => meeting.meetingId === props.meetingId))
    return <Loading />;
  if (!myInfo) return <Loading />;

  const requests = requestsData.find(
    (meeting) => meeting.meetingId === props.meetingId
  );

  // Requests functions
  const onRequestButton = (
    meetingId: number,
    requestId: number,
    requestToJoinMeetingStatus: "ACCEPTED" | "DENIED"
  ) => {
    dispatch(
      updateRequestStatus({
        meetingId: meetingId,
        requestId: requestId,
        requestToJoinMeetingStatus: requestToJoinMeetingStatus,
      })
    );
  };
  const onDeleteParticipantButton = (
    meetingId: number,
    participantId: number
  ) => {
    dispatch(
      updateParticipantInMeeting({
        meetingId: meetingId,
        participantId: participantId,
        updateParticipantStatusReqDto: "REMOVE",
      })
    );
  };

  return (
    <>
      <p className={generalStyles.title}>Заявки</p>
      <div className={generalStyles.people_block}>
        {requests!.data!.requests.length === 0
          ? "у вас нет заявок"
          : requests!.data!.requests.map((request) => (
              <div className={styles.request_item}>
                <NavLink
                  to={`/user/${request.userId}`}
                  className={styles.request_username}
                >
                  <GetUsernameById userId={request.userId} />
                </NavLink>
                <p className={styles.request_description}>
                  {request.description}
                </p>
                <div className={styles.buttons_container}>
                  <div
                    className={styles.accept_button}
                    onClick={() =>
                      onRequestButton(props.meetingId, request.id, "ACCEPTED")
                    }
                  >
                    <AcceptSVG />
                  </div>
                  <div
                    className={styles.reject_button}
                    onClick={() =>
                      onRequestButton(props.meetingId, request.id, "DENIED")
                    }
                  >
                    <RejectSVG />
                  </div>
                </div>
              </div>
            ))}
      </div>
      <p className={generalStyles.title}>Участники</p>
      <div className={generalStyles.people_block}>
        {props.participantsIds.length === 0
          ? "пока что нет участников"
          : props.participantsIds.map((participant) => (
              <>
                {participant !== myInfo.id && (
                  <div className={styles.participant_item}>
                    <NavLink
                      to={`/user/${participant}`}
                      className={styles.participant_username}
                    >
                      <GetUsernameById userId={participant} />
                    </NavLink>
                    <div
                      className={styles.delete_participant_button}
                      onClick={() =>
                        onDeleteParticipantButton(props.meetingId, participant)
                      }
                    >
                      <RejectSVG />
                    </div>
                  </div>
                )}
                {participant === myInfo.id && (
                  <NavLink
                    to="/profile/events"
                    className={generalStyles.participant_item}
                  >
                    <GetUsernameById userId={participant} />
                  </NavLink>
                )}
              </>
            ))}
      </div>
    </>
  );
};
