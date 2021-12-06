import { useDispatch, useSelector } from "react-redux";
import { getRequestsByMeetingId } from "store/meetingsSlice";
import { RootState } from "store";
import { useEffect } from "react";
import { GetUsernameById } from "utils/MeetingsFunctions";
import {
  updateParticipantInMeeting,
  updateRequestStatus,
} from "store/meetingRequestsSlice";

export const CreatedMeeting = (props: {
  participantsIds: number[];
  meetingId: number;
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRequestsByMeetingId(Number(props.meetingId)));
  }, [dispatch, props.meetingId]);

  const { data: requestsData } = useSelector(
    (state: RootState) => state.meetings.myCreatedMeetings.requests
  );
  const { data: myInfo } = useSelector((state: RootState) => state.profile.myInfo);

  if (!requestsData) return <p>LoadingRequests</p>;
  if (!myInfo) return <p>LoadingMyInfo</p>;

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
    <div>
      <p>Заявки</p>
      <div>
        {requestsData.requests.length === 0
          ? "у вас нет заявок"
          : requestsData.requests.map((request) => (
              <div>
                <p>
                  <GetUsernameById userId={request.userId} />
                </p>
                <div>
                  <button
                    onClick={() =>
                      onRequestButton(props.meetingId, request.id, "ACCEPTED")
                    }
                  >
                    Принять
                  </button>
                  <button
                    onClick={() =>
                      onRequestButton(props.meetingId, request.id, "DENIED")
                    }
                  >
                    Отклонить
                  </button>
                </div>
              </div>
            ))}
      </div>
      <p>Участники</p>
      <div>
        {props.participantsIds.length === 0
          ? "пока что нет участников"
          : props.participantsIds.map((participant) => (
              <div>
                <p>
                  <GetUsernameById userId={participant} />
                </p>
                <div>
                  {myInfo?.id !== participant && (
                    <button
                      onClick={() =>
                        onDeleteParticipantButton(props.meetingId, participant)
                      }
                    >
                      Удалить
                    </button>
                  )}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};
