import {MeetingType} from "types/MeetingTypes";


export const MeetingItem = (props: {
    meeting: MeetingType
    status: "FINISHED" | "CREATED"
    isMine: boolean
}) => {
    return <div>{props.meeting.description}</div>
}