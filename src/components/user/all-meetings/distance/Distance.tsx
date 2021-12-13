import Slider from "antd/lib/slider";
import 'antd/lib/slider/style/css'
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import {setAllMeetings, setAllMeetingsTotalPage} from "store/meetingsSlice";

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
  const [interimDistance, setInterimDistance] = useState(10000);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(async () => {
      props.setDistanceInKilometers(interimDistance);
      await dispatch(setAllMeetingsTotalPage(1))
      await dispatch(setAllMeetings(null));
      props.setCurrentPage(0);
      props.setFetching(true)
    }, 30);
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
          defaultValue={10000}
          max={10000}
          min={1}
          onChange={(value) => {
            setInterimDistance(value);
          }}
        />
        <p className={styles.distanceValue}>{`${interimDistance} км`}</p>
      </div>
    </div>
  );
};
