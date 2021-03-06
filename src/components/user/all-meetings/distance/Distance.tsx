import Slider from "antd/lib/slider";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { setAllMeetings, setAllMeetingsTotalPage } from "store/meetingsSlice";

import styles from "./Distance.module.scss";

import { ReactComponent as DropdownArrowSVG } from "../media/dropdownArrow.svg";

export const Distance = (props: {
  distanceInKilometers: number;
  setDistanceInKilometers: Dispatch<SetStateAction<number>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setFetching: Dispatch<SetStateAction<boolean>>;
}) => {
  // Redux
  const dispatch = useDispatch();

  // State
  const [interimDistance, setInterimDistance] = useState(1000);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(async () => {
        props.setDistanceInKilometers(interimDistance);
        await dispatch(setAllMeetingsTotalPage(1));
        await dispatch(setAllMeetings(null));
        props.setCurrentPage(0);
        props.setFetching(true);
    }, 500);
  }, [interimDistance]);

  return (
    <div
      className={classNames(styles.dropdownBox, {
        [styles.visible]: visible,
      })}
    >
      {"Расстояние от вас "}
      <span className={styles.span}>{`${interimDistance} км`}</span>
      <DropdownArrowSVG />
      <div className={styles.toggle} onClick={() => setVisible(!visible)} />
      <div className={styles.dropdownContent}>
        <Slider
          defaultValue={1000}
          max={1000}
          min={1}
          onAfterChange={(value) => {
            setInterimDistance(value);
          }}
        />
        <p className={styles.distanceValue}>{`${interimDistance} км`}</p>
      </div>
    </div>
  );
};
