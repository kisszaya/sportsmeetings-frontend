import { lazy } from "react";

export const CreateMeeting = lazy(
  () => import("./create-meeting/CreateMeeting")
);

// Profile
export const Events = lazy(() => import("./profile/events/Events"));
export const Reviews = lazy(() => import("./profile/reviews/Reviews"));
export { EditProfile } from "./profile/edit-profile/EditProfile";

// Meetings
export const AllMeetings = lazy(() => import("./all-meetings/AllMeetings"));
export const CreatedMeetings = lazy(
  () => import("./my-meetings/created-meetings/CreatedMeetings")
);
export const FinishedCreatedMeetings = lazy(
  () =>
    import("./my-meetings/finished-created-meetings/FinishedCreatedMeetings")
);
export const AttendedMeetings = lazy(
  () => import("./my-meetings/attended-meetings/AttendedMeetings")
);
export const FinishedAttendedMeetings = lazy(
  () =>
    import("./my-meetings/finished-attended-meetings/FinishedAttendedMeetings")
);
export { ModalMeeting } from "./modal-meeting/ModalMeeting";

// Meeting page
export const MeetingPageContainer = lazy(
  () => import("./meeting-page/MeetingPageContainer")
);
export { AttendedMeeting } from "./meeting-page/attended-meeting/AttendedMeeting";
export { CreatedMeeting } from "./meeting-page/created-meeting/CreatedMeeting";

// User profile
export const UserProfile = lazy(() => import("./user-profile/UserProfile"));
export { CreateComment } from "./user-profile/create-comment/CreateComment";
