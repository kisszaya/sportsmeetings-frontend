import { Dispatch, SetStateAction } from "react";
import classNames from "classnames";

import styles from "./Paginator.module.scss";

export const Paginator = (props: {
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPage: number;
  currentPage: number;
}) => {
  let pages = [];
  for (let i = 1; i <= props.totalPage; i++) pages.push(i);
  return (
    <div className={styles.container}>
      {pages.map((page) => (
        <div key={page}
          onClick={() => props.setCurrentPage(page - 1)}
          className={classNames(styles.page, {
            [styles.active_page]: props.currentPage === page - 1,
          })}
        >
          {page}
        </div>
      ))}
    </div>
  );
}
