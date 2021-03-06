import { useDispatch, useSelector } from "react-redux";
import { getRequestsByMeetingId } from "store/meetingsSlice";
import { RootState } from "store";
import { useEffect } from "react";
import { GetUsernameById } from "utils/MeetingsFunctions";
import {
  updateParticipantInMeeting,
  updateRequestStatus,
} from "store/meetingRequestsSlice";
import { Loading } from "components/general";
import { NavLink } from "react-router-dom";

import generalStyles from "../MeetingsPage.module.scss";
import styles from "./CreatedMeeting.module.scss";

import { ReactComponent as AcceptSVG } from "../media/accept.svg";
import { ReactComponent as RejectSVG } from "../media/reject.svg";

export const CreatedMeeting = (props: {
  participantsIds: number[];
  meetingId: number;
}) => {
  // Redux
  const dispatch = useDispatch();
  const {
    data: requestsData,
    status,
    error,
  } = useSelector(
    (state: RootState) => state.meetings.myCreatedMeetings.requests
  );
  useEffect(() => {
    if (!requestsData.find((meeting) => meeting.meetingId === props.meetingId))
      dispatch(getRequestsByMeetingId(Number(props.meetingId)));
  }, [dispatch, props.meetingId, requestsData]);

  const { data: myInfo } = useSelector(
    (state: RootState) => state.profile.myInfo
  );

  // If not loaded
  if (!requestsData.find((meeting) => meeting.meetingId === props.meetingId))
    return <Loading />;
  if (!myInfo || status === "loading") return <Loading />;
  if (error) return <p>{error}</p>;

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
      <p className={generalStyles.title}>????????????</p>
      <div className={generalStyles.people_block}>
        {requests!.data!.requests.length === 0
          ? "?? ?????? ?????? ????????????"
          : requests!.data!.requests.map((request, index) => (
              <div className={styles.request_item} key={index}>
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
      <p className={generalStyles.title}>??????????????????</p>
      <div className={generalStyles.people_block}>
        {props.participantsIds.length === 0
          ? "???????? ?????? ?????? ????????????????????"
          : props.participantsIds.map((participant, index) => (
              <>
                {participant !== myInfo.id && (
                  <div className={styles.participant_item} key={index}>
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
                    key={index}
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
