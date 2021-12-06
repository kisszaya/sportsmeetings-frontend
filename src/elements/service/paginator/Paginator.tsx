import { Dispatch, SetStateAction } from "react";

export const Paginator = (props: {
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPage: number;
  currentPage: number;
}) => {
  return <div>pag</div>;
};
