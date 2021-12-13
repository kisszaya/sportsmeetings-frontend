export type CoordinatesType = {
  lat: null | number;
  lng: null | number;
};

export type CreateMeetingType = {
  categoryId: number;
  description: string;
  endDate: {
    dayOfMonth: number;
    hourOfDay: number;
    minute: number;
    month: number;
    timeZoneOffset: number;
  };
  latitude: number;
  longitude: number;
  maxNumbOfParticipants: number;
  startDate: {
    dayOfMonth: number;
    hourOfDay: number;
    minute: number;
    month: number;
    timeZoneOffset: number;
  };
};

export type CreateMeetingFormikType = {
  coordinates: CoordinatesType;
  categoryId: null | number;
  description: null | string;
  dayOfMonth: null | number;
  hourOfDay: null | number;
  minute: null | number;
  month: null | number;
  meetingDurationMinutes: null | number;
  maxNumbOfParticipants: null | number;
};

export type getMeetingsType = {
  id: number;
  categoryId: number;
  creatorId: number;
  description: string;
  startDate: string;
  endDate: string;
  latitude: number;
  longitude: number;
  maxNumbOfParticipants: number;
  participantsIds: Array<number>;
};

export type getAllMeetingsPageType = {
  currentPage: number;
  totalPage: number;
  meetings: getMeetingsType;
};

export type getAllCategoriesType = {
  currentPage: number;
  totalPage: number;
  categories: { id: number; name: string }[];
};

export type getAllMeetingsType = {
  currentPage: number;
  meetings: {
    categoryId: number;
    creatorId: number;
    description: string;
    endDate: string;
    id: number;
    latitude: number;
    longitude: number;
    maxNumbOfParticipants: number;
    participantsIds: number[];
    startDate: string;
  }[];
  totalPage: number;
};

export type allMeetingsType = {
  categoryId: number;
  creatorId: number;
  description: string;
  endDate: string;
  id: number;
  latitude: number;
  longitude: number;
  maxNumbOfParticipants: number;
  participantsIds: number[];
  startDate: string;
}[];

export type MeetingType = {
  categoryId: number;
  creatorId: number;
  description: string;
  endDate: string;
  id: number;
  latitude: number;
  longitude: number;
  maxNumbOfParticipants: number;
  participantsIds: number[];
  startDate: string;
};

export type getRequestsByMeetingIdType = {
  currentPage: number;
  requests: {
    description: string;
    id: number;
    meetingId: number;
    userId: number;
  }[];
  totalPage: number;
};

export type updateRequestStatusType = {
  description: string;
  id: number;
  meetingId: number;
  userId: number;
};

export type getMeetingByIdType = {
  categoryId: number;
  creatorId: number;
  description: string;
  endDate: string;
  id: number;
  latitude: number;
  longitude: number;
  maxNumbOfParticipants: number;
  participantsIds: number[];
  startDate: string;
};
