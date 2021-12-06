export type getMyInfoType = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  roles: Array<string>;
  email: string;
};

export type getMyCreatedCommentsType = {};

export type getUserInfoType = {
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  roles: string[];
  username: string;
};

export type getCommentsType = {
  comments: {
    authorId: number;
    id: number;
    text: string;
  }[];
  currentPage: number;
  totalPage: number;
};

export type createCommentType = {
  authorId: number;
  id: number;
  text: string;
};
