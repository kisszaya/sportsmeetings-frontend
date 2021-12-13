import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { Dispatch, SetStateAction, useState } from "react";
import classNames from "classnames";

import styles from "./Categories.module.scss";

import { ReactComponent as DropdownArrowSVG } from "../media/dropdownArrow.svg";
import {setAllMeetings, setAllMeetingsTotalPage} from "store/meetingsSlice";

export const Categories = (props: {
  setCategoryIds: Dispatch<SetStateAction<number[] | null>>;
  categoryIds: number[] | null;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setFetching: Dispatch<SetStateAction<boolean>>;
}) => {
  // Redux
  const { categories } = useSelector((state: RootState) => state.categories);
  const dispatch = useDispatch();

  // State
  const [visible, setVisible] = useState(false);

  const onCategoryClick = async (categoryId: number) => {
    if (props.categoryIds) {
      if (props.categoryIds.includes(categoryId)) {
        const newIds = props.categoryIds.filter((id) => id !== categoryId);
        props.setCategoryIds(newIds.length === 0 ? null : newIds);
      } else {
        const newIds = [...props.categoryIds, categoryId];
        props.setCategoryIds(
          newIds.length === categories?.length ? null : newIds
        );
      }
    } else {
      props.setCategoryIds([categoryId]);
    }
    await dispatch(setAllMeetingsTotalPage(1))
    await dispatch(setAllMeetings(null));
    props.setCurrentPage(0);
    props.setFetching(true);
  };

  return (
    <div
      className={classNames(styles.dropdownBox, {
        [styles.visible]: visible,
      })}
    >
      {"Категории "}
      <span className={styles.span}>
        {props.categoryIds ? `${props.categoryIds.length} категорий` : "Все"}
      </span>
      <DropdownArrowSVG />
      <div className={styles.toggle} onClick={() => setVisible(!visible)} />
      <div className={styles.dropdownList}>
        {categories?.map(
          (item, index) =>
            item && (
              <div
                key={index}
                className={classNames(styles.dropdownItem, {
                  [styles.dropdownItemActive]: props.categoryIds?.includes(
                    item.id
                  ),
                })}
                onClick={() => {
                  setVisible(false);
                  onCategoryClick(item.id);
                }}
              >
                {item.name}
              </div>
            )
        )}
      </div>
    </div>
  );
};
