import { AllMeetings} from "components/user";

import { Navigate } from "react-router-dom";
import { UserRouteRedirect } from "hoc";
import CreateMeeting from "../user/create-meeting/CreateMeeting";
import Reviews from "../user/profile/reviews/Reviews";
import Events from "../user/profile/events/Events";
import CreatedMeetings from "../user/my-meetings/created-meetings/CreatedMeetings";
import AttendedMeetings from "../user/my-meetings/attended-meetings/AttendedMeetings";
import UserProfile from "../user/user-profile/UserProfile";
import MeetingPageContainer from "../user/meeting-page/MeetingPageContainer";
import FinishedCreatedMeetings from "../user/my-meetings/finished-created-meetings/FinishedCreatedMeetings";
import FinishedAttendedMeetings from "../user/my-meetings/finished-attended-meetings/FinishedAttendedMeetings";

export const userRoutes = [
  {
    element: (
      <UserRouteRedirect>
        <Navigate to="/meetings" />
      </UserRouteRedirect>
    ),
    path: "/",
  },
  {
    element: (
      <UserRouteRedirect>
        <AllMeetings />
      </UserRouteRedirect>
    ),
    path: "/meetings",
  },
  {
    element: (
      <UserRouteRedirect>
        <Reviews />
      </UserRouteRedirect>
    ),
    path: "/profile/reviews",
  },
  {
    element: (
      <UserRouteRedirect>
        <Events />
      </UserRouteRedirect>
    ),
    path: "/profile/events",
  },
  {
    element: (
      <UserRouteRedirect>
        <CreatedMeetings />
      </UserRouteRedirect>
    ),
    path: "/meetings/created",
  },
  {
    element: (
        <UserRouteRedirect>
          <FinishedCreatedMeetings />
        </UserRouteRedirect>
    ),
    path: "/meetings/created/finished",
  },
  {
    element: (
      <UserRouteRedirect>
        <AttendedMeetings />
      </UserRouteRedirect>
    ),
    path: "/meetings/attended",
  },
  {
    element: (
        <UserRouteRedirect>
          <FinishedAttendedMeetings />
        </UserRouteRedirect>
    ),
    path: "/meetings/attended/finished",
  },
  {
    element: (
      <UserRouteRedirect>
        <MeetingPageContainer />
      </UserRouteRedirect>
    ),
    path: "/meetings/:meetingType/:id",
  },
  {
    element: (
      <UserRouteRedirect>
        <CreateMeeting />
      </UserRouteRedirect>
    ),
    path: "/create_meeting",
  },
  {
    element: (
      <UserRouteRedirect>
        <UserProfile />
      </UserRouteRedirect>
    ),
    path: "/user/:id",
  },
];
